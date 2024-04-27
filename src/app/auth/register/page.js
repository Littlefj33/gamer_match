"use client";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/FirebaseFunctions";
import SocialSignIn from "../SocialSignIn.js";

export default function Register() {
    // const { currentUser } = useContext(AuthContext);
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

    // if (currentUser) {
    //     return <Navigate to="/home" />;
    // }

    return (
        <div>
            <SocialSignIn />
        </div>
    );
}
