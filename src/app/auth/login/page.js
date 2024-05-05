"use client";
import SocialSignIn from "../SocialSignIn.js";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { doSignInWithEmailAndPassword } from "@/firebase/FirebaseFunctions.js";

export default function Login() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        let { email, password } = event.target.elements;
        try {
            setLoading(true);
            await doSignInWithEmailAndPassword(email.value, password.value);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    };

    if (currentUser) {
        redirect("/");
    }

    if (loading) {
        return <div>Loading...</div>;
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
                <p>
                    <a href="/auth/register">
                        No account? Click here to Register!
                    </a>
                </p>
            </form>
            <SocialSignIn />
        </div>
    );
}
