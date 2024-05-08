"use server";

import {
    rejectFriendRequest,
    acceptFriendRequest,
} from "../../../backend/data/friends";
import { getUserByUsername } from "../../../backend/helpers";

export async function getUser(username) {
    try {
        const result = await getUserByUsername(username);
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}

export async function rejectRequest({ recipientName, senderName }) {
    try {
        let { reject } = await rejectFriendRequest(recipientName, senderName);
        if (!reject) {
            throw "ERROR: Reject friend request failed";
        } else {
            return JSON.stringify({ success: true });
        }
    } catch (e) {
        console.log(e);
        return "ERROR";
    }
}

export async function acceptRequest({ recipientName, senderName }) {
    try {
        let { accept } = await acceptFriendRequest(recipientName, senderName);
        if (!accept) {
            throw "ERROR: Accept friend request failed";
        } else {
            return JSON.stringify({ success: true });
        }
    } catch (e) {
        console.log(e);
        return "ERROR";
    }
}
