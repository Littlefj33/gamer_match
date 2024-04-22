import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "GamerMatch | My Friends",
    description: "My Friends page for GamerMatch",
};

export default function Layout({ children }) {
    return (
        <>
            <div className="w-full h-screen bg-sky-100 text-black">
                {children}
            </div>
        </>
    );
}