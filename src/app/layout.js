import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/lib/header/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "GamerMatch",
	description: "Never game alone again",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Header />
				{children}
			</body>
		</html>
	);
}
