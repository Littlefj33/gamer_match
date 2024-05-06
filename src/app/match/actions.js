"use server";

import { sendFriendRequest } from "../../../backend/data/friends";
import { matchOnAchievements } from "../../../backend/data/steam";

/* Form actions to communicate to backend */

export async function achievementMatch({ userEmail, matchType, gameName }) {
    /**
     * TODO
     * - Client-side validation
     */

    try {
        const matchedUsers = await matchOnAchievements(
            userEmail,
            gameName,
            matchType
        );
        return matchedUsers;
    } catch (e) {
        console.log(e);
        throw "ERROR";
    }
}

export async function addFriend({ senderName, recipientName }) {
    /**
     * TODO
     * - Client-side validation
     */
    try {
        let result = await sendFriendRequest(senderName, recipientName);
    } catch (e) {
        console.log(e);
        return "ERROR";
    }
}
