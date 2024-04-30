import Header from "@/lib/header/header";
import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "GamerMatch | Match",
    description: "Matching page for GamerMatch",
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
