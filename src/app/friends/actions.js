/* actions to communicate to backend to get user info */
"use server";

import {
    getUserByUsername,
    updateSentPendingRequests,
} from "../../../backend/helpers";

export async function getUser(username) {
    try {
        const result = await getUserByUsername(username);
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}

export async function getRequests(name, sent, nameReq, pending) {
    try {
        const pendingReqs = await updateSentPendingRequests(
            name,
            sent,
            nameReq,
            pending
        );
        return JSON.stringify(pendingReqs);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}
