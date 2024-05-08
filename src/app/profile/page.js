"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { doSignOut } from "@/utils/firebase/FirebaseFunctions.js";
import {
    getUser,
    seedDatabase,
    linkSteamAccount,
    unlinkSteamAccount,
    isAccountLinked,
    getSteamUsersGames,
    getRecentlyPlayed,
    getTopFiveGames,
    deleteUserData,
} from "./actions";
import Link from "next/link";
import { stringCheck } from "@/utils/helpers";

export default function Profile() {
    const { currentUser } = useContext(AuthContext);
    const [pageLoading, setPageLoading] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);

    const [userData, setUserData] = useState({});
    const [IdError, setIdError] = useState({});
    const [serverError, setServerError] = useState({});

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

    /* Button functions */
    const handleSignOut = async () => {
        try {
            await doSignOut();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSeedDB = async () => {
        try {
            await seedDatabase();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLink = async (e) => {
        e.preventDefault();
        let { steamId } = e.target;

        steamId = steamId.value;
        let emailAddress = currentUser.email;

        let IdStatus = stringCheck(steamId);
        if (IdStatus.isValid == false) {
            setIdError({ steamId: IdStatus.errors.message });
            return;
        }

        try {
            setLinkLoading(true);
            let mongoResponse = await linkSteamAccount({
                emailAddress,
                steamId,
            });
            if (mongoResponse.success == false) {
                setServerError({ 0: mongoResponse.error });
                setLinkLoading(false);
                return;
            }
            await getSteamUsersGames({ emailAddress });
            await getRecentlyPlayed({ emailAddress });
            await getTopFiveGames({ emailAddress });
            setLinkLoading(false);
            await fetchData();
        } catch (error) {
            setLinkLoading(false);
            alert(error);
        }
    };

    const handleUnlink = async (e) => {
        e.preventDefault();
        let emailAddress = currentUser.email;

        try {
            setLinkLoading(true);
            await deleteUserData({ emailAddress });
            await unlinkSteamAccount({ emailAddress });
            setLinkLoading(false);
            await fetchData();
        } catch (error) {
            setLinkLoading(false);
            alert(error);
        }
    };

    /* Paging functions */
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

    /* Execute on page load */
    const fetchData = async () => {
        try {
            setPageLoading(true);
            const result = await getUser(currentUser.displayName);
            console.log(JSON.parse(result));
            setUserData(JSON.parse(result));
            setPageLoading(false);
        } catch (e) {
            setPageLoading(false);
            console.log(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!currentUser) {
        redirect("/auth/login");
    }

    if (pageLoading) {
        return (
            <div>
                <h2>Loading Your Information...</h2>
            </div>
        );
    } else {
        return (
            <div>
                {Object.keys(userData).length !== 0 ? (
                    <div>
                        <h1 className="text-center text-3xl font-bold mb-6 text-persian-blue">
                            Welcome, {userData.username}!
                        </h1>
                        <div className="flex justify-evenly text-center">
                            <div className="w-1/5">
                                <h3 className="underline font-bold text-lg">
                                    General
                                </h3>
                                <div className="flex flex-col">
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
                                                Steam Id:
                                            </p>
                                            <p className="font-semibold">
                                                {userData.steamId}
                                            </p>

                                            <button
                                                className="my-3 max-w-48 w-full h-10 bg-persian-blue text-white font-bold rounded-full"
                                                onClick={handleUnlink}
                                            >
                                                Unlink Steam Account
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="italic text-red-800">
                                                No SteamId
                                            </p>

                                            {linkLoading ? (
                                                <div className="flex justify-center items-center text-center mx-10">
                                                    <div className="p-2 border-white bg-white rounded-full">
                                                        Loading...
                                                    </div>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleLink}>
                                                    <div>
                                                        <label>
                                                            Steam ID:
                                                            <input
                                                                required
                                                                name="steamId"
                                                                type="text"
                                                                placeholder="Steam ID"
                                                                className="mx-4 max-w-48 bg-white shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                                            />
                                                        </label>
                                                    </div>
                                                    <button
                                                        id="submitButton"
                                                        type="submit"
                                                        className="my-3 max-w-48 w-full h-10 bg-persian-blue text-white font-bold rounded-full"
                                                    >
                                                        Link Steam Account
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    )}

                                    {userData.steamAccountUsername ? (
                                        <div>
                                            <p className="font-bold">
                                                Steam Account:
                                            </p>
                                            <Link
                                                className=""
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

                            <div className="w-1/5">
                                {userData.recentlyPlayed.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Recently Played:{" "}
                                            {userData.recentlyPlayedCount
                                                ? `*${userData.recentlyPlayedCount}`
                                                : "0"}
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
                                            Recently Played Games:{" "}
                                            {userData.recentlyPlayedCount
                                                ? `*${userData.recentlyPlayedCount}`
                                                : "0"}
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
                                            {userData.gamesOwnedCount
                                                ? `*${userData.gamesOwnedCount}`
                                                : "0"}
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
                                            Owned Games:{" "}
                                            {userData.gamesOwnedCount
                                                ? `*${userData.gamesOwnedCount}`
                                                : "0"}
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

                <div className="text-center">
                    <button
                        className="mt-4 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                </div>

                <div className="text-center">
                    <button
                        className="mt-4 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                        onClick={handleSeedDB}
                    >
                        Seed Database
                    </button>
                </div>
            </div>
        );
    }
}
