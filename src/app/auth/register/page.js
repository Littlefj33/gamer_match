"use client";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import {useFormState as useFormState} from 'react-dom';
import { registerUser } from '../../actions';
import { doCreateUserWithEmailAndPassword } from "@/firebase/FirebaseFunctions.js";
const initialState = {
    displayName: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
};

export default function Register() {
    const { currentUser } = useContext(AuthContext);
    const [state, formAction] = useFormState(registerUser, initialState);
    const [pwMatch, setPwMatch] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { displayName, email, passwordOne, passwordTwo } =
            e.target.elements;
        if (passwordOne.value !== passwordTwo.value) {
            setPwMatch("Passwords do not match");
            return false;
        }

        try {
            await doCreateUserWithEmailAndPassword(
                email.value,
                passwordOne.value,
                displayName.value
            );
        } catch (error) {
            alert(error);
        }
    };

    if (currentUser) {
        redirect("/profile");
    }

    return (
        <div>
            {pwMatch && <h4 className="error">{pwMatch}</h4>}
            <form action={formAction} onSubmit={handleSignUp}>
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
        </div>
    );
}
