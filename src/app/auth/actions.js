"use server";

import { userData } from "../../../backend/data";

export async function registerUser(formData) {
    let { username, email, password } = formData;

    /**
     * TODO:
     * - Server-side validation (within backend functions?)
     */

    try {
        const response = await userData.registerUser(username, email, password);
        if (!response.insertedUser) {
            throw "ERROR: Could not register user";
        }
    } catch (e) {
        console.log(e);
        return "Register Failed";
    }
}

export async function loginUser(formData) {
    let { email, password } = formData;

    /**
     * TODO:
     * - Server-side validation (within backend functions?)
     */

    try {
        const response = await userData.loginUser(email, password);
        if (!response) {
            throw "ERROR: Could not signin user";
        }
    } catch (e) {
        console.log(e);
        return "Sign-in failed";
    }
}
