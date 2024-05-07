"use client";
import Link from "next/link";
import {
    emailValidation,
    passwordValidation,
    usernameValidation,
    passwordMatch,
} from "@/utils/helpers";
import { redirect } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { registerUser } from "../actions";
import { doCreateUserWithEmailAndPassword } from "@/utils/firebase/FirebaseFunctions";

export default function Register() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState({});
    const [emailError, setEmailError] = useState({});
    const [passwordError, setPasswordError] = useState({});
    const [matchPasswordError, setMatchPasswordError] = useState({});
    const [serverError, setServerError] = useState({});

    const handleSignUp = async (e) => {
        e.preventDefault();
        let { username, email, password, confirmPassword } = e.target;

        username = username.value;
        email = email.value;
        password = password.value;
        confirmPassword = confirmPassword.value;

        let matchPasswordStatus = passwordMatch(password, confirmPassword);
        if (matchPasswordStatus.isValid == false) {
            setMatchPasswordError({
                password: matchPasswordStatus.errors.message,
            });
        }
        let usernameStatus = usernameValidation(username);
        if (usernameStatus.isValid == false) {
            setUsernameError({ username: usernameStatus.errors.message });
        }
        let emailStatus = emailValidation(email);
        if (emailStatus.isValid == false) {
            setEmailError({ email: emailStatus.errors.message });
        }
        let passwordStatus = passwordValidation(password);
        if (passwordStatus.isValid == false) {
            setPasswordError({ password: passwordStatus.errors.message });
        }
        if (
            usernameStatus.isValid == false ||
            emailStatus.isValid == false ||
            passwordStatus.isValid == false
        ) {
            return;
        }

        try {
            setLoading(true);
            let mongoResponse = await registerUser({ username, email, password });
            if (mongoResponse.success == false) {
                setServerError({ 0: mongoResponse.error });
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
                    {Object.keys(usernameError).length !== 0 ? (
                        <div className="text-red-500">
                            <h2>ERROR:</h2>
                            <ul>
                                {Object.keys(usernameError).map((key, i) => {
                                    return (
                                        <li key={i}>
                                            {key}: {usernameError[key]}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div>
                    <label>
                        Email Address:
                        <input
                            required
                            name="email"
                            type="email"
                            placeholder="Email"
                        />
                    </label>
                    {Object.keys(emailError).length !== 0 ? (
                        <div className="text-red-500">
                            <h2>ERROR:</h2>
                            <ul>
                                {Object.keys(emailError).map((key, i) => {
                                    return (
                                        <li key={i}>
                                            {key}: {emailError[key]}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <></>
                    )}
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
                    {Object.keys(passwordError).length !== 0 ? (
                        <div className="text-red-500">
                            <h2>ERROR:</h2>
                            <ul>
                                {Object.keys(passwordError).map((key, i) => {
                                    return (
                                        <li key={i}>
                                            {key}: {passwordError[key]}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <></>
                    )}
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
                    {Object.keys(matchPasswordError).length !== 0 ? (
                        <div className="text-red-500">
                            <h2>ERROR:</h2>
                            <ul>
                                {Object.keys(matchPasswordError).map(
                                    (key, i) => {
                                        return (
                                            <li key={i}>
                                                {key}: {matchPasswordError[key]}
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <button id="submitButton" type="submit">
                    Sign Up
                </button>
            </form>

            {Object.keys(serverError).length !== 0 ? (
                <div className="text-red-500">
                    <h2>ERROR:</h2>
                    <ul>
                        {Object.keys(serverError).map((key, i) => {
                            return (
                                <li key={i}>
                                    {key}: {serverError[key]}
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
