/* actions to communicate to backend to get user info */
"use server";

import { getUserByUsername } from "../../../backend/helpers";
import { getSteamUser } from "../../../backend/data/steam";
import { userData, steamData } from "../../../backend/data";
import {
    acceptFriendRequest,
    sendFriendRequest,
} from "../../../backend/data/friends";
import im from "imagemagick";
import axios from "axios";

export async function getUser(username) {
    try {
        const result = await getUserByUsername(username);
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}

export async function getSteamInfo(id) {
    try {
        const result = await getSteamUser(id);
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}

export async function imageModify(imgUrl) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(imgUrl, {
                responseType: "arraybuffer",
            });

            const bufferedChunks = response.data;

            const newImage = await new Promise((resolve, reject) => {
                im.resize(
                    {
                        srcData: bufferedChunks,
                        width: 400,
                        height: 400,
                        gravity: "North",
                    },
                    (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(Buffer.from(stdout, "binary"));
                        }
                    }
                );
            });

            const base64Image = newImage.toString("base64");
            resolve(`data:image/jpg;base64,${base64Image}`);
        } catch (error) {
            reject(error);
        }
    });
}

export async function linkSteamAccount(formData) {
    let { emailAddress, steamId } = formData;
    try {
        await userData.linkSteamAccount(emailAddress, steamId);
        return { success: true };
    } catch (e) {
        return { error: e.message, success: false };
    }
}

export async function unlinkSteamAccount(formData) {
    let { emailAddress } = formData;
    try {
        await userData.unlinkSteamAccount(emailAddress);
        return { success: true };
    } catch (e) {
        return { error: e.message, success: false };
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

export async function getSteamUsersGames(formData) {
    let { emailAddress } = formData;
    try {
        return await steamData.getSteamUsersGames(emailAddress);
    } catch (e) {
        return { error: e.message, success: false };
    }
}

export async function getRecentlyPlayed(formData) {
    let { emailAddress } = formData;
    try {
        return await steamData.getRecentlyPlayed(emailAddress);
    } catch (e) {
        return { error: e.message, success: false };
    }
}

export async function getTopFiveGames(formData) {
    let { emailAddress } = formData;
    try {
        return await steamData.getTopFiveGames(emailAddress);
    } catch (e) {
        return { error: e.message, success: false };
    }
}

export async function deleteUserData(formData) {
    let { emailAddress } = formData;
    try {
        return await steamData.deleteUserData(emailAddress);
    } catch (e) {
        return { error: e.message, success: false };
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
        {
            username: "BigMan",
            email: "bigman@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198068707772",
        },
        {
            username: "SmallFellow",
            email: "smallellow@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198097969047",
        },
        {
            username: "AwwYea",
            email: "wwea@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198097969047",
        },
        {
            username: "WhatTheHail",
            email: "hatheail@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198097969047",
        },
        {
            username: "nonsense",
            email: "nonsense@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198097969047",
        },
        {
            username: "guacamole",
            email: "guacamole@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198097969047",
        },
        {
            username: "Lolz",
            email: "olz@mail.com",
            password: "Password123!!!!",
            steamLink: "76561198097969047",
        },
    ];

    try {
        for (let i = 0; i < seedUsers.length; i++) {
            const user = seedUsers[i];
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
        }

        await sendFriendRequest("twang", "Aero");
        await sendFriendRequest("twang", "CausticLimes");
        await sendFriendRequest("twang", "Shinks");
        await sendFriendRequest("Aero", "CausticLimes");
        await sendFriendRequest("Aero", "Shinks");
        await sendFriendRequest("CausticLimes", "Shinks");

        await acceptFriendRequest("Aero", "twang");
        await acceptFriendRequest("CausticLimes", "twang");
        await acceptFriendRequest("Shinks", "twang");
        await acceptFriendRequest("CausticLimes", "Aero");
        await acceptFriendRequest("Shinks", "Aero");
        await acceptFriendRequest("Shinks", "CausticLimes");

        console.log("Program has been seeded successfully!");
    } catch (e) {
        console.log("Seed ERROR", e);
    }
}
