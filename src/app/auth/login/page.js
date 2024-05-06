"use client";
import Link from "next/link";
import { passwordInputCheck } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { loginUser } from "../actions.js";
import { doSignInWithEmailAndPassword } from "@/utils/firebase/FirebaseFunctions.js";

export default function Login() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [errorObj, setErrorObj] = useState({});

    const handleLogin = async (e) => {
        e.preventDefault();
        let { email, password } = e.target;

        email = email.value;
        password = password.value;

        let validation = passwordInputCheck(email, password);
        if (validation.isValid == false) {
            setErrorObj(validation.errors);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let mongoResponse = await loginUser({ email, password });
            if (mongoResponse.success == false) {
                setErrorObj({ 0: mongoResponse.error });
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

            <Link href="/auth/register">
                No account? Click here to Register!
            </Link>
        </div>
    );
}
