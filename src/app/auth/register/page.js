"use client";
import Link from "next/link";
import { usernameInputCheck } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { registerUser } from "../actions";
import { doCreateUserWithEmailAndPassword } from "@/utils/firebase/FirebaseFunctions";

export default function Register() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [errorObj, setErrorObj] = useState({});

    const handleSignUp = async (e) => {
        e.preventDefault();
        let { username, email, password, confirmPassword } = e.target;

        username = username.value;
        email = email.value;
        password = password.value;
        confirmPassword = confirmPassword.value;

        if (password !== confirmPassword) {
            setErrorObj({ 0: "Passwords do not match" });
            setLoading(false);
            return;
        }

        let validation = usernameInputCheck(username, email, password);
        if (validation.isValid == false) {
            setErrorObj(validation.errors);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let mongoResponse = await registerUser({ username, email, password });
            if (mongoResponse.success == false) {
                setErrorObj({ 0: mongoResponse.error });
                setLoading(false);
                return;
            }
            await doCreateUserWithEmailAndPassword(email, password, username);
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
            <form onSubmit={handleSignUp}>
                <div>
                    <label>
                        Name:
                        <input
                            required
                            name="username"
                            type="text"
                            placeholder="Name"
                            autoFocus={true}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            required
                            name="email"
                            type="email"
                            placeholder="Email"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            autoComplete="off"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Confirm Password:
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            autoComplete="off"
                            required
                        />
                    </label>
                </div>
                <button id="submitButton" type="submit">
                    Sign Up
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

            <Link href="/auth/login">
                Already have an account? Click here to Login!
            </Link>
        </div>
    );
}
