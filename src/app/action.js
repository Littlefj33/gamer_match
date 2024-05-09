//home page actions
"use server";

import { getTrendingGames } from "../../backend/data/steam";

export async function getTrending() {
    try {
        const result = await getTrendingGames();
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}
