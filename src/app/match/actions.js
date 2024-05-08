"use server";

import {
    checkRequestStatus,
    sendFriendRequest,
} from "../../../backend/data/friends";
import {
    findTopMatchesOnLibrary,
    getTopFiveGames,
    matchOnAchievements,
    matchUsersOnPlaytimeByGame,
} from "../../../backend/data/steam";
import * as userData from "../../../backend/data/users";

/* TODO
    - Server-side validation
    - Test everything using non-hardcoded data
    - Fix error functionality
*/

export async function achievementMatch({ userEmail, matchType, gameName }) {
    try {
        const matchedUsers = await matchOnAchievements(
            userEmail,
            gameName,
            matchType
        );

        const result = {
            type: "achievements",
            matchType,
            gameName,
            matchedUsers,
        };

        return JSON.stringify(result);
    } catch (e) {
        return { error: e.message, success: false };
    }
}

export async function playtimeMatch({ userEmail, gameName }) {
    try {
        const matchedUsers = await matchUsersOnPlaytimeByGame(
            userEmail,
            gameName
        );

        const result = {
            type: "playtime",
            gameName,
            matchedUsers,
        };

        return JSON.stringify(result);
    } catch (e) {
        return { error: e.message, success: false };
    }
}

export async function libraryMatch({ userEmail }) {
    try {
        const matchedUsers = await findTopMatchesOnLibrary(userEmail);

        const result = {
            type: "library",
            matchedUsers,
        };

        return JSON.stringify(result);
    } catch (e) {
        return { error: e.message, success: false };
    }
}

export async function generateAutoMatches({ userEmail }) {
    function randomIndex(arrLen) {
        return Math.floor(Math.random() * arrLen);
    }

    try {
        const achMatchTypes = ["iAchieved", "theyAchieved", "neitherAchieved"];
        const chosenAchMatchType =
            achMatchTypes[randomIndex(achMatchTypes.length)];

        const top5games = await getTopFiveGames(userEmail);
        if (top5games.length === 0) throw "Account has no games in library";

        const chosenGame = top5games[randomIndex(top5games.length)];

        const autoResults = [];
        let achResult = await achievementMatch({
            userEmail,
            matchType: chosenAchMatchType,
            gameName: chosenGame.name,
        });
        achResult = JSON.parse(achResult);
        autoResults.push(achResult);

        const chosenGame2 = top5games[randomIndex(top5games.length)];
        let playResult = await playtimeMatch({
            userEmail,
            gameName: chosenGame2.name,
        });
        playResult = JSON.parse(playResult);
        autoResults.push(playResult);

        let libResult = await libraryMatch({ userEmail });
        libResult = JSON.parse(libResult);
        autoResults.push(libResult);

        return JSON.stringify(autoResults);
    } catch (e) {
        console.log(e);
        throw "ERROR";
    }
}

export async function addFriend({ senderName, recipientName }) {
    /* TODO
        - Server-side validation
        - Fix error functionality
    */
    try {
        let { friendRequestSent } = await sendFriendRequest(
            senderName,
            recipientName
        );

        if (!friendRequestSent) {
            throw "ERROR: Friend request failed";
        } else {
            return JSON.stringify({ success: true });
        }
    } catch (e) {
        console.log(e);
        return "ERROR";
    }
}

export async function getFriendStatus({ username, otherUsername }) {
    // TODO Server validation
    try {
        const status = await checkRequestStatus(username, otherUsername);
        return JSON.stringify(status);
    } catch (e) {
        console.log(e);
        throw "ERROR";
    }
}

export async function isAccountLinked(formData) {
    let { emailAddress } = formData;
    try {
        return await userData.isAccountLinked(emailAddress);
    } catch (e) {
        return { error: e.message, success: false };
    }
}
