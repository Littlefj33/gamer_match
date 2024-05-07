"use client";
import Link from "next/link";
import { emailValidation, passwordValidation } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { loginUser } from "../actions.js";
import { doSignInWithEmailAndPassword } from "@/utils/firebase/FirebaseFunctions.js";

export default function Login() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState({});
    const [passwordError, setPasswordError] = useState({});
    const [serverError, setServerError] = useState({});

    const handleLogin = async (e) => {
        e.preventDefault();
        let { email, password } = e.target;

        email = email.value;
        password = password.value;

        let emailStatus = emailValidation(email);
        if (emailStatus.isValid == false) {
            setEmailError({ email: emailStatus.errors.message });
        }
        let passwordStatus = passwordValidation(password);
        if (passwordStatus.isValid == false) {
            setPasswordError({ password: passwordStatus.errors.message });
        }
        if (emailStatus.isValid == false || passwordStatus.isValid == false) {
            return;
        }

        try {
            setLoading(true);
            let mongoResponse = await loginUser({ email, password });
            if (mongoResponse.success == false) {
                setServerError({ 0: mongoResponse.error });
                setLoading(false);
                return;
            }
            await doSignInWithEmailAndPassword(email, password);
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
                <button className="button" type="submit">
                    Log in
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

            <Link href="/auth/register">
                No account? Click here to Register!
            </Link>
        </div>
    );
}
