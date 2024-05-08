"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { getUser, getSteamInfo, imageModify } from "./actions";
import Link from "next/link";

export default function Profile({params}) {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [profileData, setProfileData] = useState({});
    const [oldProfileData, setOldProfileData] = useState({});

    const [friendListPage, setFriendListPage] = useState(1);
    const friendsPerPage = 10;
    const totalFriendPages = Math.ceil(userData.friendCount / friendsPerPage);
    const startFriendPage = (friendListPage - 1) * friendsPerPage;

    const [recentlyPlayedListPage, setRecentlyPlayedPage] = useState(1);
    const recentlyPlayedPage = 10;
    const totalRecentPlayedPages = Math.ceil(
        userData.recentlyPlayedCount / recentlyPlayedPage
    );
    const startRecentPlayedPage =
        (recentlyPlayedListPage - 1) * recentlyPlayedPage;

    const [recentlyOwnedListPage, setOwnedListPage] = useState(1);
    const recentlyOwnedPage = 10;
    const totalOwnedPages = Math.ceil(
        userData.gamesOwnedCount / recentlyOwnedPage
    );
    const startOwnedPage = (recentlyOwnedListPage - 1) * recentlyOwnedPage;

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("hi")
                const result = await getUser(params.username);
                console.log(params.username)
                //console.log(JSON.parse(result))
                const steamData = await getSteamInfo(JSON.parse(result).steamId)
                console.log(JSON.parse(steamData))
                let profileUrl = JSON.parse(steamData).avatarfull;
                console.log(profileUrl);
                console.log(params.username)
                const modifiedProfile = await imageModify(profileUrl)
                setUserData(JSON.parse(result));
                setProfileData(modifiedProfile)
                setOldProfileData(profileUrl)
                setLoading(false); 
                setUserData(JSON.parse(result));
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, []);

    const nextFriendPage = () => {
        if (friendListPage < totalFriendPages) {
            setFriendListPage(friendListPage + 1);
        }
    };
    const prevFriendPage = () => {
        if (friendListPage > 1) {
            setFriendListPage(friendListPage - 1);
        }
    };

    const nextRecentlyPlayedPage = () => {
        if (recentlyPlayedListPage < totalRecentPlayedPages) {
            setRecentlyPlayedPage(recentlyPlayedListPage + 1);
        }
    };
    const prevRecentlyPlayedPage = () => {
        if (recentlyPlayedListPage > 1) {
            setRecentlyPlayedPage(recentlyPlayedListPage - 1);
        }
    };

    const nextOwnedPage = () => {
        if (recentlyOwnedListPage < totalOwnedPages) {
            setOwnedListPage(recentlyOwnedListPage + 1);
        }
    };
    const prevOwnedPage = () => {
        if (recentlyOwnedListPage > 1) {
            setOwnedListPage(recentlyOwnedListPage - 1);
        }
    };

    if (!currentUser) {
        redirect("/auth/login");
    }

    //  if (currentUser) {
    //      redirect("/profile");
    // }

    if (loading) {
        return (
            <div>
                <h2>Loading User Information...</h2>
            </div>
        );
    } else {
        return (
            <div>
                <img src={profileData}/>
                <img src={oldProfileData}/>
                {Object.keys(userData).length !== 0 ? (
                    <div>
                        <h1 className="text-center text-3xl font-bold mb-6 text-persian-blue">
                            Welcome to {userData.username}'s Page!
                        </h1>
                        <div className="grid grid-cols-5 gap-4 text-center">
                            <div>
                                <h3 className="underline font-bold text-lg">
                                    General
                                </h3>
                                <div>
                                    <div>
                                        <p className="font-bold inline">
                                            Email Address:{" "}
                                        </p>
                                        <p className="inline">
                                            {userData.emailAddress}
                                        </p>
                                    </div>

                                    {userData.steamId ? (
                                        <div>
                                            <p className="font-bold inline">
                                                SteamId:{" "}
                                            </p>
                                            <p className="inline">
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
                                            <p className="font-bold inline">
                                                Steam Account:{" "}
                                            </p>
                                            <Link
                                                className="inline"
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

                            <div>
                                {userData.top5MostPlayed.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Top 5 Games
                                        </h3>
                                        <ul>
                                            {userData.top5MostPlayed.map(
                                                (game, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <p>
                                                                Title:{" "}
                                                                {game.title}
                                                            </p>
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
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

                            <div>
                                {userData.recentlyPlayed.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Recently Played
                                        </h3>
                                        <ul>
                                            {userData.recentlyPlayed
                                                .slice(
                                                    startRecentPlayedPage,
                                                    startRecentPlayedPage +
                                                        recentlyPlayedPage
                                                )
                                                .map((recentGame, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <p>
                                                                Title:{" "}
                                                                {
                                                                    recentGame.title
                                                                }
                                                            </p>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                        <div>
                                            <button
                                                onClick={prevRecentlyPlayedPage}
                                                disabled={
                                                    recentlyPlayedListPage < 1
                                                }
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={nextRecentlyPlayedPage}
                                                disabled={
                                                    recentlyPlayedListPage >=
                                                    totalRecentPlayedPages
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Recently Played Games
                                        </h3>
                                        <div>
                                            <p className="italic text-red-800">
                                                No Recently Played Games
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                {userData.gamesOwned.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Owned Games
                                        </h3>
                                        <ul>
                                            {userData.gamesOwned
                                                .slice(
                                                    startOwnedPage,
                                                    startOwnedPage +
                                                        recentlyOwnedPage
                                                )
                                                .map((ownedGame, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <p>
                                                                Title:{" "}
                                                                {
                                                                    ownedGame.title
                                                                }
                                                            </p>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                        <div>
                                            <button
                                                onClick={prevOwnedPage}
                                                disabled={
                                                    recentlyOwnedListPage < 1
                                                }
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={nextOwnedPage}
                                                disabled={
                                                    recentlyOwnedListPage >=
                                                    totalOwnedPages
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Owned Games
                                        </h3>
                                        <div>
                                            <p className="italic text-red-800">
                                                No Owned Games
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                {userData.friendList.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Friends List: {userData.friendCount}
                                        </h3>
                                        <ul>
                                            {userData.friendList
                                                .slice(
                                                    startFriendPage,
                                                    startFriendPage +
                                                        friendsPerPage
                                                )
                                                .map((friend, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <Link
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
                                        <div>
                                            <button
                                                onClick={prevFriendPage}
                                                disabled={friendListPage < 1}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={nextFriendPage}
                                                disabled={
                                                    friendListPage >=
                                                    totalFriendPages
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Friends List: {userData.friendCount}
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
