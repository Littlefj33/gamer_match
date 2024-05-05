"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { doSignOut } from "@/utils/firebase/FirebaseFunctions.js";

export default function Profile() {
    const { currentUser } = useContext(AuthContext);

    const handleSignOut = async () => {
        try {
            await doSignOut();
        } catch (error) {
            console.error(error);
        }
    };

    if (!currentUser) {
        redirect("/auth/login");
    }

    return (
        <div>
            {currentUser ? (
                <h1>{currentUser.displayName}</h1>
            ) : (
                <h1>Not signed in</h1>
            )}

            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}
