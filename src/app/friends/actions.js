"use server";

import {
    getPendingRequests,
    getSentRequests,
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

export async function getSent(username) {
    try {
        const sent = await getSentRequests(username);
        return JSON.stringify(sent);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}

export async function getPending(username) {
    try {
        const pending = await getPendingRequests(username);
        return JSON.stringify(pending);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}
