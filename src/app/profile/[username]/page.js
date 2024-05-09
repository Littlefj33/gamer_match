"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { getUser, getSteamInfo, imageModify } from "./actions";
import Link from "next/link";
import Image from "next/image";

export default function Profile({ params }) {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [profileData, setProfileData] = useState({});
    const [oldProfileData, setOldProfileData] = useState({});

    const [curFriendPage, setFriendPage] = useState(0);
    const [curRecentPlayPage, setRecentPlayPage] = useState(0);
    const [curOwnedPage, setCurOwnedPage] = useState(0);
    const [doRedirect, setDoRedirect] = useState(false);

    const username = params.username;

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                let result = await getUser(username);
                result = JSON.parse(result);
                if (result.success === false) {
                    setDoRedirect(true);
                    throw "NOT A USER!";
                }
                setUserData(result);
                const steamData = await getSteamInfo(
                    JSON.parse(result).steamId
                );
                let profileUrl = JSON.parse(steamData).avatarfull;
                const modifiedProfile = await imageModify(profileUrl);
                setProfileData(modifiedProfile);
                setOldProfileData(profileUrl);
                setLoading(false);
                return true;
            } catch (e) {
                setLoading(false);
                return false;
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (doRedirect) {
            redirect("/not-found");
        }
    }, [doRedirect]);

    const handlePrevFriendPage = () => {
        if (curFriendPage > 0) {
            setFriendPage(curFriendPage + 1);
        }
    };
    const handleNextFriendPage = () => {
        if (curFriendPage < Math.ceil(userData.friendList.length / 10) - 1) {
            setFriendPage(curFriendPage - 1);
        }
    };

    const handlePrevRecentPlayedPage = () => {
        if (curRecentPlayPage > 0) {
            setRecentPlayPage(curRecentPlayPage - 1);
        }
    };

    const handleNextRecentPlayedPage = () => {
        if (
            curRecentPlayPage <
            Math.ceil(userData.recentlyPlayed.length / 10) - 1
        ) {
            setRecentPlayPage(curRecentPlayPage + 1);
        }
    };

    const handlePrevOwnedPage = () => {
        if (curOwnedPage > 0) {
            setCurOwnedPage(curOwnedPage - 1);
        }
    };

    const handleNextOwnedPage = () => {
        if (curOwnedPage < Math.ceil(userData.gamesOwned.length / 10) - 1) {
            setCurOwnedPage(curOwnedPage + 1);
        }
    };

    if (!currentUser) {
        redirect("/auth/login");
    }

    if (currentUser.displayName === username) {
        redirect("/profile");
    }

    if (loading) {
        return (
            <div>
                <h2>Loading User Information...</h2>
            </div>
        );
    } else {
        return (
            <div>
                {Object.keys(userData).length !== 0 ? (
                    <div>
                        <div className="flex items-center justify-center">
                            <h1 className="text-center text-3xl font-bold mb-6 text-persian-blue">
                                Welcome to {userData.username}'s Page!
                            </h1>
                            <div className="ml-4">
                                <Image
                                    src={profileData}
                                    alt="Profile Icon"
                                    width="50"
                                    height="50"
                                    style={{
                                        objectFit: "fill",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-evenly text-center">
                            <div className="w-1/5">
                                <h3 className="underline font-bold text-lg">
                                    General
                                </h3>
                                <div>
                                    <div>
                                        <p className="font-bold">
                                            Email Address:
                                        </p>
                                        <p className="">
                                            {userData.emailAddress}
                                        </p>
                                    </div>

                                    {userData.steamId ? (
                                        <div>
                                            <p className="font-bold">
                                                SteamId:
                                            </p>
                                            <p className="">
                                                {userData.steamId}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="italic text-red-800">
                                            No SteamId
                                        </p>
                                    )}

                                    {userData.steamAccountUsername ? (
                                        <div>
                                            <p className="font-bold ">
                                                Steam Account:
                                            </p>
                                            <Link
                                                className="inline text-blue-700 hover:underline hover:font-bold"
                                                href={userData.steamProfileLink}
                                            >
                                                {userData.steamAccountUsername}
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="italic text-red-800">
                                            Steam Account Not Connected
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="w-1/5">
                                {userData.top5MostPlayed.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Top 5 Games
                                        </h3>
                                        <div className="ml-3 text-left">
                                            <ul className="list-disc list-inside break-all overflow-hidden">
                                                {userData.top5MostPlayed.map(
                                                    (game, i) => {
                                                        return (
                                                            <li key={i}>
                                                                {game.name}
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Top 5 Games
                                        </h3>
                                        <div>
                                            <p className="italic text-red-800">
                                                No Top 5 Games
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-1/5">
                                {userData.recentlyPlayed.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Recently Played{" "}
                                            {userData.recentlyPlayed.length}
                                        </h3>
                                        <div className="ml-3 text-left">
                                            <ul className="list-disc list-inside break-all overflow-hidden">
                                                {userData.recentlyPlayed &&
                                                    userData.recentlyPlayed
                                                        .slice(
                                                            curRecentPlayPage *
                                                                10,
                                                            (curRecentPlayPage +
                                                                1) *
                                                                10
                                                        )
                                                        .map(
                                                            (recentGame, i) => {
                                                                return (
                                                                    <li key={i}>
                                                                        {
                                                                            recentGame.name
                                                                        }
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                            </ul>
                                        </div>
                                        <div>
                                            {curRecentPlayPage === 0 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 mr-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={
                                                        handlePrevRecentPlayedPage
                                                    }
                                                >
                                                    Prev
                                                </button>
                                            )}
                                            {curRecentPlayPage >=
                                            Math.ceil(
                                                userData.recentlyPlayed.length /
                                                    10
                                            ) -
                                                1 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 ml-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={
                                                        handleNextRecentPlayedPage
                                                    }
                                                >
                                                    Next
                                                </button>
                                            )}
                                            <h3 className="font-bold">
                                                Page {curRecentPlayPage + 1}/
                                                {Math.ceil(
                                                    userData.recentlyPlayed
                                                        .length /
                                                        10 -
                                                        1
                                                ) + 1}
                                            </h3>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Recently Played Games:{" "}
                                            {userData.recentlyPlayed.length}
                                        </h3>
                                        <div>
                                            <p className="italic text-red-800">
                                                No Recently Played Games
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-1/5">
                                {userData.gamesOwned.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Owned Games:{" "}
                                            {userData.gamesOwned.length}
                                        </h3>
                                        <div className="ml-3 text-left">
                                            <ul className="list-disc list-inside break-all overflow-hidden">
                                                {userData.gamesOwned &&
                                                    userData.gamesOwned
                                                        .slice(
                                                            curOwnedPage * 10,
                                                            (curOwnedPage + 1) *
                                                                10
                                                        )
                                                        .map((ownedGame, i) => {
                                                            return (
                                                                <li key={i}>
                                                                    {
                                                                        ownedGame.name
                                                                    }
                                                                </li>
                                                            );
                                                        })}
                                            </ul>
                                        </div>
                                        <div>
                                            {curOwnedPage === 0 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 mr-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={
                                                        handlePrevOwnedPage
                                                    }
                                                >
                                                    Prev
                                                </button>
                                            )}
                                            {curOwnedPage >=
                                            Math.ceil(
                                                userData.gamesOwned.length / 10
                                            ) -
                                                1 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 ml-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={
                                                        handleNextOwnedPage
                                                    }
                                                >
                                                    Next
                                                </button>
                                            )}
                                            <h3 className="font-bold">
                                                Page {curOwnedPage + 1}/
                                                {Math.ceil(
                                                    userData.gamesOwned.length /
                                                        10 -
                                                        1
                                                ) + 1}
                                            </h3>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Owned Games:{" "}
                                            {userData.gamesOwned.length}
                                        </h3>
                                        <div>
                                            <p className="italic text-red-800">
                                                No Owned Games
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-1/5">
                                {userData.friendList.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Friends List:{" "}
                                            {userData.friendList.length}
                                        </h3>
                                        <div className="ml-3 text-left">
                                            <ul className="list-disc list-inside break-all overflow-hidden">
                                                {userData.friendList &&
                                                    userData.friendList
                                                        .slice(
                                                            curFriendPage * 10,
                                                            (curFriendPage +
                                                                1) *
                                                                10
                                                        )
                                                        .map((friend, i) => {
                                                            return (
                                                                <li key={i}>
                                                                    <Link
                                                                        className="inline text-blue-700 hover:underline hover:font-bold"
                                                                        href={`/profile/${friend.username}`}
                                                                    >
                                                                        {
                                                                            friend.username
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                            </ul>
                                        </div>
                                        <div>
                                            {curFriendPage === 0 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 mr-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={
                                                        handlePrevFriendPage
                                                    }
                                                >
                                                    Prev
                                                </button>
                                            )}
                                            {curFriendPage >=
                                            Math.ceil(
                                                userData.friendList.length / 10
                                            ) -
                                                1 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 ml-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={
                                                        handleNextFriendPage
                                                    }
                                                >
                                                    Next
                                                </button>
                                            )}
                                            <h3 className="font-bold">
                                                Page {curFriendPage + 1}/
                                                {Math.ceil(
                                                    userData.friendList.length /
                                                        10 -
                                                        1
                                                ) + 1}
                                            </h3>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Friends List:{" "}
                                            {userData.friendList.length}
                                        </h3>
                                        <div>
                                            <p className="italic text-red-800">
                                                No Added Friends
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <h1>Not signed in</h1>
                )}
            </div>
        );
    }
}
