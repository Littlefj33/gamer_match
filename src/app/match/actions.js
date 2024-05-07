"use server";

import { sendFriendRequest } from "../../../backend/data/friends";
import {
    findTopMatchesOnLibrary,
    getTopFiveGames,
    matchOnAchievements,
    matchUsersOnPlaytimeByGame,
} from "../../../backend/data/steam";

/* TODO
    - Client-side validation
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

        /* Hardcoded results
        const result = {
            type: "achievements",
            matchType,
            gameName,
            matchedUsers: [
                {
                    username: "GamerName1",
                    playtime: 3543254325425432542534,
                },
                {
                    username: "GamerName2",
                    playtime: 243,
                },
                {
                    username: "GamerName3",
                    playtime: 365,
                },
                {
                    username: "GamerName4",
                    playtime: 457654,
                },
                {
                    username: "GamerName5",
                    playtime: 524,
                },
                {
                    username: "GamerName6",
                    playtime: 1,
                },
                {
                    username: "GamerName7",
                    playtime: 1500,
                },
                {
                    username: "GamerName8",
                    playtime: 875,
                },
                {
                    username: "GamerName9",
                    playtime: 6534,
                },
                {
                    username: "GamerName10",
                    playtime: 876,
                },
                {
                    username: "GamerName11",
                    playtime: 43,
                },
                {
                    username: "GamerName12",
                    playtime: 87,
                },
                {
                    username: "GamerName13",
                    playtime: 453252543,
                },
            ],
        };

         Hardcoded matchedUsers
        //Games
        matchedUsers: [
            {
                username: "GamerName1",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName2",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName3",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName4",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName5",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName6",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName7",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName8",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName9",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName10",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName11",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName12",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
            {
                username: "GamerName13",
                gamesShared: ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"],
            },
        ],

        // Playtime
        matchedUsers: [
            {
                username: "GamerName1",
                playtime: 100,
            },
            {
                username: "GamerName2",
                playtime: 243,
            },
            {
                username: "GamerName3",
                playtime: 365,
            },
            {
                username: "GamerName4",
                playtime: 457654,
            },
            {
                username: "GamerName5",
                playtime: 524,
            },
            {
                username: "GamerName6",
                playtime: 1,
            },
            {
                username: "GamerName7",
                playtime: 1500,
            },
            {
                username: "GamerName8",
                playtime: 875,
            },
            {
                username: "GamerName9",
                playtime: 6534,
            },
            {
                username: "GamerName10",
                playtime: 876,
            },
            {
                username: "GamerName11",
                playtime: 43,
            },
            {
                username: "GamerName12",
                playtime: 87,
            },
            {
                username: "GamerName13",
                playtime: 453252543,
            },
        ],

        // Achievements
        matchedUsers: [
                {
                    username: "GamerName",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName2",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName3",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName4",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName5",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName6",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName7",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName8",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName9",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName10",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
                {
                    username: "GamerName11",
                    achievements: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3",
                        "Achievement 4",
                        "Achievement 5",
                    ],
                },
        ],
        */

        return JSON.stringify(result);
    } catch (e) {
        console.log(e);
        throw "ERROR";
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
        console.log(e);
        throw "ERROR";
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
        console.log(e);
        throw "ERROR";
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

        console.log(userEmail, chosenAchMatchType, chosenGame);
        const autoResults = [];
        autoResults.push(
            JSON.parse(
                await achievementMatch({
                    userEmail,
                    matchType: chosenAchMatchType,
                    gameName: chosenGame,
                })
            )
        );

        const chosenGame2 = top5games[randomIndex(top5games.length)];
        autoResults.push(
            JSON.parse(
                await playtimeMatch({ userEmail, gameName: chosenGame2 })
            )
        );

        autoResults.push(JSON.parse(await libraryMatch({ userEmail })));

        return JSON.stringify(autoResults);
    } catch (e) {
        console.log(e);
        throw "ERROR";
    }
}

export async function addFriend({ senderName, recipientName }) {
    /* TODO
        - Client-side validation
        - Fix error functionality
    */
    try {
        let { friendRequestSent } = await sendFriendRequest(
            senderName,
            recipientName
        );

        if (!friendRequestSent) {
            throw "ERROR: Friend request failed";
        }
    } catch (e) {
        console.log(e);
        return "ERROR";
    }
}
