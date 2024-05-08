/* actions to communicate to backend to get user info */
"use server";

import { userData, steamData } from "../../../backend/data";
import {
    acceptFriendRequest,
    sendFriendRequest,
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

export async function seedDatabase() {
    const seedUsers = [
        {
            username: "twang",
            email: "twang@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198061876066",
        },
        {
            username: "Aero",
            email: "aero@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198160939488",
        },
        {
            username: "CausticLimes",
            email: "causticlimes@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198024306587",
        },
        {
            username: "Shinks",
            email: "shinks@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198097969047",
        },
    ];

    try {
        Promise.all(
            seedUsers.map(async (user, i) => {
                await userData.registerUser(
                    user.username,
                    user.email,
                    user.password
                );
                await userData.linkSteamAccount(user.email, user.steamLink);
                await steamData.getSteamUsersGames(user.email);
                await steamData.getRecentlyPlayed(user.email);
                await steamData.getTopFiveGames(user.email);
                console.log(`${i + 1}/${seedUsers.length} Users Seeded`);
            })
        );
        console.log("Program has been seeded successfully!");
    } catch (e) {
        console.log("Seed ERROR", e);
    }
}
