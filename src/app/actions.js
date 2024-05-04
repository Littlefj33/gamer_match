'use server';
import { userData } from "../../backend/data/index.js";

export async function registerUser(prevState, formData) {
    let username, emailAddress, password;
    let errors = [];
    username = formData.get("displayName");
    emailAddress = formData.get("email");
    password = formData.get("passwordOne");

    try {
        console.log(await userData.registerUser(username, emailAddress, password));
    } catch (e) {
        return { message: e };
    }
}
