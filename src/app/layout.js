"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/lib/header/header";
import { AuthProvider } from "@/context/AuthContext";
import Auth from "./auth/page";

const inter = Inter({ subsets: ["latin"] });

// can't have useclient and metadata at the same time, need to find a workaround
// export const metadata = {
//     title: "GamerMatch",
//     description: "Never game alone again",
// };

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <Header />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
