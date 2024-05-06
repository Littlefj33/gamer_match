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
