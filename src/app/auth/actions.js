"use server";
import { userData } from "../../../backend/data";

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