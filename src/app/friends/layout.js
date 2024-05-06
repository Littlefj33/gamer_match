import "../globals.css";
import Header from "@/lib/header/header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "GamerMatch | My Friends",
    description: "My Friends page for GamerMatch",
};

export default function Layout({ children }) {
    return (
        <>
            <Header />

            <div className="w-full h-screen bg-platinum text-black">
                {children}
            </div>
        </>
    );
}
