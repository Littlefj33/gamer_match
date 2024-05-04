"use client";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { doCreateUserWithEmailAndPassword } from "@/firebase/FirebaseFunctions.js";

export default function Register() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { displayName, email, passwordOne, passwordTwo } =
            e.target.elements;
        if (passwordOne.value !== passwordTwo.value) {
            setPwMatch("Passwords do not match");
            return false;
        }

        try {
            setLoading(true);
            await doCreateUserWithEmailAndPassword(
                email.value,
                passwordOne.value,
                displayName.value
            );
            await axios.post("/api/auth/register", {
                displayName: displayName.value,
                email: email.value,
                password: passwordOne.value,
            });
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
            {pwMatch && <h4 className="error">{pwMatch}</h4>}
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label>
                        Name:
                        <br />
                        <input
                            className="form-control"
                            required
                            name="displayName"
                            type="text"
                            placeholder="Name"
                            autoFocus={true}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Email:
                        <br />
                        <input
                            className="form-control"
                            required
                            name="email"
                            type="email"
                            placeholder="Email"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Password:
                        <br />
                        <input
                            className="form-control"
                            id="passwordOne"
                            name="passwordOne"
                            type="password"
                            placeholder="Password"
                            autoComplete="off"
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Confirm Password:
                        <br />
                        <input
                            className="form-control"
                            name="passwordTwo"
                            type="password"
                            placeholder="Confirm Password"
                            autoComplete="off"
                            required
                        />
                    </label>
                </div>
                <button
                    className="button"
                    id="submitButton"
                    name="submitButton"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
            <br />
            <p>
                <a href="/auth/login">
                    Already have an account? Click here to Login!
                </a>
            </p>
        </div>
    );
}
