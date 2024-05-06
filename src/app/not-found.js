'use client';
import Header from "@/lib/header/header";
import { redirect } from "next/navigation";
import "./globals.css";

export default function Custom404() {
  const handleRedirect = async (e) => {
    e.preventDefault();
    try {
        redirect("/");
    } catch (error) {
        alert(error);
    }
};

  return (
    <>
        <Header />
        <div className="w-full h-screen bg-platinum text-black">
            <form onSubmit={handleRedirect}>
                <button className="button" type="submit">
                    404: Click here to go back to the home page!
                </button>
            </form>
        </div>
    </>
);
}
