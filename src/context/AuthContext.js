import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/utils/firebase/FirebaseConfig";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const auth = getAuth(app);
    useEffect(() => {
        let myListener = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoadingUser(false);
        });
        return () => {
            if (myListener) myListener();
        };
    }, []);

    if (loadingUser) {
        return (
            <div>
                <h1>Loading....</h1>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
