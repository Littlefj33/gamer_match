'use server';
import { userData } from "../../backend/data/index.js";

// abandoning the use of the client-side formAction hook, need to create an API instead
export async function registerUser(prevState, formData) {
    let username, emailAddress, password;
    let errors = [];
    username = formData.get("displayName");
    emailAddress = formData.get("email");
    password = formData.get("passwordOne");
    try {
        await userData.registerUser(username, emailAddress, password);
    } catch (e) {
        return { message: e };
    }
}
