"use server";

import { sendFriendRequest } from "../../../backend/data/friends";
import { matchOnAchievements } from "../../../backend/data/steam";

/* TODO
    - Add functionality for matching user using playtime & shared library
    - Test everything using non-hardcoded data
*/

export async function achievementMatch({ userEmail, matchType, gameName }) {
    /* TODO
        - Client-side validation
        - Actual backend calls (remove hardcoded results)
        - Fix error functionality
    */

    try {
        /* Actual call to backend 
        const result = await matchOnAchievements(
            userEmail,
            gameName,
            matchType
        );
        */

        /* Hardcoded results */
        const result = {
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
        };

        return JSON.stringify(result);
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
