"use server";

import { redirect } from "next/navigation";
import {
    doCreateUserWithEmailAndPassword,
    doSignInWithEmailAndPassword,
} from "@/utils/firebase/FirebaseFunctions";
import { userData } from "../../../backend/data";

export async function registerUser(formData) {
    let { username, email, password } = formData;

    /**
     * TODO:
     * - Server-side validation (within backend functions?)
     */

    /* Send user input to backend for validation and submission
		- If valid: redirect to '/'
		- Otherwise present error on page
	*/
    try {
        const response = await userData.registerUser(username, email, password);
        if (!response.insertedUser) {
            throw "ERROR: Could not register user";
        }

        await doCreateUserWithEmailAndPassword(email, password, username);
    } catch (e) {
        console.log(e);
        return "Register Failed";
    }

    redirect("/auth/login");
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

        await doSignInWithEmailAndPassword(email, password);
    } catch (e) {
        console.log(e);
        return "Sign-in failed";
    }

    redirect("/");
}
