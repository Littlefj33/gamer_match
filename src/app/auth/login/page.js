"use client";
import SocialSignIn from "../SocialSignIn.js";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import {
    doSignInWithEmailAndPassword,
    doPasswordReset,
} from "@/firebase/FirebaseFunctions.js";

export default function Login() {
    const { currentUser } = useContext(AuthContext);

    const handleLogin = async (event) => {
        event.preventDefault();
        let { email, password } = event.target.elements;
        try {
            await doSignInWithEmailAndPassword(email.value, password.value);
        } catch (error) {
            alert(error);
        }
    };

    const passwordReset = (event) => {
        event.preventDefault();
        let email = document.getElementById("email").value;
        if (email) {
            doPasswordReset(email);
            alert("Password reset email was sent");
        } else {
            alert(
                "Please enter an email address below before you click the forgot password link"
            );
        }
    };

    if (currentUser) {
        redirect("/profile");
    }

    return (
        <div>
            <form className="form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label>
                        Email Address:
                        <br />
                        <input
                            name="email"
                            id="email"
                            type="email"
                            placeholder="Email"
                            required
                            autoFocus={true}
                        />
                    </label>
                </div>
                <br />
                <div className="form-group">
                    <label>
                        Password:
                        <br />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            autoComplete="off"
                            required
                        />
                    </label>
                </div>

                <button className="button" type="submit">
                    Log in
                </button>
                <br />
                <button className="forgotPassword" onClick={passwordReset}>
                    Forgot Password
                </button>
            </form>
            <SocialSignIn />
        </div>
    );
}
