"use client";
import { redirect } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { doSignOut } from "@/utils/firebase/FirebaseFunctions.js";

export default function Login() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await doSignOut();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    };

    if (!currentUser) {
        redirect("/");
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <form onSubmit={handleLogout}>
                <button className="button" type="submit">
                    Click here to Logout!
                </button>
            </form>
        </div>
    );
}
