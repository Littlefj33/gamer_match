"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <div className="w-full h-16 flex flex-wrap items-center justify-center bg-light-blue text-black">
            <div className="w-24 h-auto relative overflow-hidden ml-8">
                <Link href="/">
                    <Image
                        src="/assets/logo.png"
                        alt="GamerMatch Logo"
                        width={100}
                        height={100}
                    />
                </Link>
            </div>

            <div className="mx-auto h-10 flex flex-wrap justify-center items-center">
                <div className="w-40 h-full text-center bg-persian-blue rounded-lg">
                    <Link href="/">Home</Link>
                </div>

                <div className="w-40 h-full text-center bg-persian-blue rounded-lg">
                    <Link href="/match">Match</Link>
                </div>

                <div className="w-40 h-full text-center bg-persian-blue rounded-lg">
                    <Link href="/friends">Friends</Link>
                </div>
            </div>

            <div className="w-24 h-auto relative overflow-hidden mr-8">
                <Link href="/profile">
                    <Image
                        src="/assets/profile_icon.png"
                        alt="Profile Icon"
                        width={100}
                        height={100}
                    />
                </Link>
            </div>
        </div>
    );
}
