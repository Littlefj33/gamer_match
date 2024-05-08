"use server";
import { userData } from "../../../backend/data";
import { steamData } from "../../../backend/data";
import { getUserByUsername } from "../../../backend/helpers";

export async function registerUser(formData) {
    let { username, email, password } = formData;
    try {
        await userData.registerUser(username, email, password);
        return { success: true };
    } catch (e) {
        return { error: e.message, success: false };
    }
}

export async function loginUser(formData) {
    let { email, password } = formData;
    try {
        await userData.loginUser(email, password);
        return { success: true };
    } catch (e) {
        return { error: e.message, success: false };
    }
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

export async function getSteamId({ username }) {
    try {
        const userData = await getUserByUsername(username);
        return { steamId: userData.steamId, success: true };
    } catch (e) {
        return { error: e.message, success: false };
    }
}
