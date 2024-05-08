"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { getUser, getSent, getPending } from "./actions";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function MyFriends() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [pendingReqs, setPendingReqs] = useState({});
    const [sentReqs, setSetReqs] = useState({});

    const [friendListPage, setFriendListPage] = useState(1);
    const friendsPerPage = 10;
    const totalFriendPages = Math.ceil(userData.friendCount / friendsPerPage);
    const startFriendPage = (friendListPage - 1) * friendsPerPage;

    const [pendingListPage, setPendingListPage] = useState(1);
    const pendingPerPage = 10;
    const totalPendingPages = Math.ceil(
        userData.pendingRequests.length / pendingPerPage
    );
    const startPendingPage = (pendingListPage - 1) * pendingPerPage;

    const [sentListPage, setSentListPage] = useState(1);
    const sentPerPage = 10;
    const totalSentPages = Math.ceil(
        userData.sentRequests.length / sentPerPage
    );
    const startSentPage = (sentListPage - 1) * sentPerPage;

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getUser(currentUser.displayName);
                const sent = await getSent(currentUser.displayName);
                const pending = await getPending(currentUser.displayName);
                console.log("result", JSON.parse(result));
                console.log("sent", JSON.parse(sent));
                console.log("pending", JSON.parse(pending));
                setUserData(JSON.parse(result));
                setSetReqs(JSON.parse(sent));
                setPendingReqs(JSON.parse(pending));
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, []);

    if (!currentUser) {
        redirect("/auth/login");
    }

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

    const nextPendingPage = () => {
        if (pendingListPage < totalPendingPages) {
            setPendingListPage(pendingListPage + 1);
        }
    };
    const prevPendingPage = () => {
        if (pendingListPage > 1) {
            setPendingListPage(pendingListPage - 1);
        }
    };

    const nextSentPage = () => {
        if (sentListPage < totalSentPages) {
            setSentListPage(sentListPage + 1);
        }
    };
    const prevSentPage = () => {
        if (sentListPage > 1) {
            setSentListPage(sentListPage - 1);
        }
    };

    if (loading) {
        return (
            <div>
                <h2>Loading Friend Information...</h2>
            </div>
        );
    } else {
        return (
            <div>
                {Object.keys(userData).length !== 0 ? (
                    <div>
                        <h1 className="text-center text-3xl font-bold mb-6 text-persian-blue">
                            Friends
                        </h1>
                        <div className="grid grid-cols-3 gap-4 text-center">
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

                            <div>
                                {userData.sentRequests.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Sent Requests:{" "}
                                            {userData.sentRequestsCount}
                                        </h3>
                                        <ul>
                                            {sentReqs
                                                .slice(
                                                    startSentPage,
                                                    startSentPage + sentPerPage
                                                )
                                                .map((sentReq, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <Link
                                                                href={`/profile/${sentReq.username}`}
                                                            >
                                                                print out
                                                                username of sent
                                                                request
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                        <div>
                                            <button
                                                onClick={prevSentPage}
                                                disabled={sentListPage < 1}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={nextSentPage}
                                                disabled={
                                                    sentListPage >=
                                                    totalSentPages
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Sent Requests:{" "}
                                            {userData.sentRequestsCount}
                                        </h3>
                                        <div>
                                            <p className="italic text-red-800">
                                                No Sent Requests
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                {userData.pendingRequests.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Pending Requests:{" "}
                                            {userData.pendingRequestsCount}
                                        </h3>
                                        <ul>
                                            {pendingReqs
                                                .slice(
                                                    startPendingPage,
                                                    startPendingPage +
                                                        pendingPerPage
                                                )
                                                .map((pendingReq, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <Link
                                                                href={`/profile/${pendingReq.username}`}
                                                            >
                                                                print out
                                                                username of
                                                                request might be
                                                                something like
                                                                pendingReqs.username
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                        <div>
                                            <button
                                                onClick={prevPendingPage}
                                                disabled={pendingListPage < 1}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={nextPendingPage}
                                                disabled={
                                                    pendingListPage >=
                                                    totalPendingPages
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Pending Requests:{" "}
                                            {userData.pendingRequestsCount}
                                        </h3>
                                        <div>
                                            <p className="italic text-red-800">
                                                No Pending Requests
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
