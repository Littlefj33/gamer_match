import { registerUser } from "../data/users.js";

try {
    registerUser("testUser", "twang@mail.com", "Password123!!!!!");
} catch (e) {
    console.log(e);
}