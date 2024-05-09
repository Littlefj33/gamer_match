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

    const [curFriendPage, setFriendPage] = useState(0);
    const [curRecentPlayPage, setRecentPlayPage] = useState(0);
    const [curOwnedPage, setCurOwnedPage] = useState(0);

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
            window.location.reload();
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
            window.location.reload();
            await fetchData();
            
        } catch (error) {
            setLinkLoading(false);
            alert(error);
        }
    };

    /* Paging functions */
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

    /* Execute on page load */
    const fetchData = async () => {
        try {
            setPageLoading(true);
            const result = await getUser(currentUser.displayName);
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
                                            <p className="">
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
                                            Recently Played:{" "}
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

                <div className="text-center">
                    <button
                        className="mt-4 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                </div>

                {currentUser.displayName === "admin" ? (
                    <div className="text-center">
                        <button
                            className="mt-4 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                            onClick={handleSeedDB}
                        >
                            Seed Database
                        </button>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    }
}
