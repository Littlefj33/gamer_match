"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState, useEffect} from "react";
import { AuthContext } from "@/context/AuthContext";
import { getUser, getSteamInfo, isSteamAccountLinked, imageModify } from "./actions";

export default function Header() {
    const { currentUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({});
    const [userData, setUserData] = useState({});
    const [isLinked, setLinkStatus] = useState(false)

    useEffect(() => {
        if (currentUser) {
            async function fetchData() {
                try {
                    const linkStatus = await isSteamAccountLinked(currentUser.email)
                    setLinkStatus(linkStatus)
                } catch (e) {
                    console.log(e);
                }
            }
        fetchData();
    }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && isLinked) {
            async function fetchData() {
                try {
                    const result = await getUser(currentUser.displayName);
                    const steamData = await getSteamInfo(JSON.parse(result).steamId)
                    let profileUrl = JSON.parse(steamData).avatarfull;
                    const modifiedProfile = await imageModify(profileUrl)
                    setUserData(JSON.parse(result));
                    setProfileData(modifiedProfile)
                } catch (e) {
                    console.log(e);
                }
            }
        fetchData();
    }
    }, [currentUser, isLinked]);

    return (
        <div className="w-full h-24 flex flex-wrap items-center justify-center bg-light-blue text-white">
            <Link
                href="/"
                className="w-20 h-full relative overflow-hidden ml-8"
            >
                <Image
                    src="/assets/logo.png"
                    alt="GamerMatch Logo"
                    sizes="300px"
                    fill
                    style={{
                        objectFit: "contain",
                    }}
                />
            </Link>

            <div className="mx-auto h-12 flex flex-wrap justify-bewteen items-center">
                <Link
                    href="/"
                    className="w-40 h-full flex items-center justify-center bg-persian-blue rounded-full text-xl mx-10"
                >
                    Home
                </Link>

                <Link
                    href="/match"
                    className="w-40 h-full flex items-center justify-center bg-persian-blue rounded-full text-xl mx-10"
                >
                    Match
                </Link>

                <Link
                    href="/friends"
                    className="w-40 h-full flex items-center justify-center bg-persian-blue rounded-full text-xl mx-10"
                >
                    Friends
                </Link>
            </div>
        
            {isLinked ? (
            <div className="w-20 h-full relative overflow-hidden mr-8">
                <Link href="/profile">
                    <Image
                        src={profileData}
                        alt="Profile Icon"
                        sizes="300px"
                        fill
                        style={{
                            objectFit: "contain",
                        }}
                    />
                </Link>
            </div>
        ) : (
            <div className="w-20 h-full relative overflow-hidden mr-8">
                <Link href="/profile">
                    <Image
                        src="/assets/profile_icon.png"
                        alt="Profile Icon"
                        sizes="300px"
                        fill
                        style={{
                            objectFit: "contain",
                        }}
                    />
                </Link>
            </div>
        )}
        </div>
    );
}
