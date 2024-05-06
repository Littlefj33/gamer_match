"use client";
import Header from "@/lib/header/header";
import Link from "next/link";
import "./globals.css";

export default function Custom404() {
    return (
        <>
            <Header />
            <div className="w-full h-screen bg-platinum text-black">
                <Link href="/">
                    404: Click here to go back to the home page!
                </Link>
            </div>
        </>
    );
}
