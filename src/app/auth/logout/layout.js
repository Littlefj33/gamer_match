import "../../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "GamerMatch | Logout",
    description: "Logout page for GamerMatch",
};

export default function Layout({ children }) {
    return (
        <>
            <div className="w-full h-screen bg-platinum text-black">
                {children}
            </div>
        </>
    );
}