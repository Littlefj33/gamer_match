"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { loginUser } from "../actions.js";
import SocialSignIn from "./SocialSignIn.jsx";

export default function Login() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [errorObj, setErrorObj] = useState({});

    const handleLogin = async (event) => {
        event.preventDefault();
        let { email, password } = event.target;

        email = email.value;
        password = password.value;

        /**
         * TODO:
         * - Client-side validation
         */

        try {
            setLoading(true);
            await loginUser({ email, password });
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
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Email Address:
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
                <div>
                    <label>
                        Password:
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
            </form>

            {Object.keys(errorObj).length !== 0 ? (
                <div className="text-red-500">
                    <h2>ERROR:</h2>
                    <ul>
                        {Object.keys(errorObj).map((key, i) => {
                            return (
                                <li key={i}>
                                    {key}: {errorObj[key]}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <></>
            )}

            <SocialSignIn />

            <Link href="/auth/register">
                No account? Click here to Register!
            </Link>
        </div>
    );
}
