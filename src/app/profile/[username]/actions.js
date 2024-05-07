/* actions to communicate to backend to get user info */
"use server";

import { getUserByUsername } from "../../../../backend/helpers";

export async function getUser(username) {
    try {
        const result = await getUserByUsername(username);
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}
