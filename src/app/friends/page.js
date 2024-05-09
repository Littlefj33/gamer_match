"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { getUser, rejectRequest, acceptRequest } from "./actions";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function MyFriends() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [pendingReqs, setPendingReqs] = useState({});
    const [sentReqs, setSetReqs] = useState({});

    const [curFriendPage, setFriendPage] = useState(0);
    const [curSentPage, setSentPage] = useState(0);
    const [curPendPage, setPendPage] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getUser(currentUser.displayName);
                //const sent = await getSent(currentUser.displayName);
                //const pending = await getPending(currentUser.displayName);
                //console.log("sent", JSON.parse(sent));
                //console.log("pending", JSON.parse(pending));
                setUserData(JSON.parse(result));
                //setSetReqs(JSON.parse(sent));
                //setPendingReqs(JSON.parse(pending));
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

    const handlePrevSentPage = () => {
        if (curSentPage > 0) {
            setSentPage(curSentPage - 1);
        }
    };

    const handleNextSentPage = () => {
        if (curSentPage < Math.ceil(userData.sentRequests.length / 10) - 1) {
            setSentPage(curSentPage + 1);
        }
    };

    const handlePrevPendPage = () => {
        if (curPendPage > 0) {
            setPendPage(curPendPage - 1);
        }
    };

    const handleNextPendPage = () => {
        if (curPendPage < Math.ceil(userData.pendingRequests.length / 10) - 1) {
            setPendPage(curPendPage + 1);
        }
    };

    const handleAccept = async (otherUser) => {
        let accept = await acceptRequest({
            recipientName: currentUser.displayName,
            senderName: otherUser,
        });
        acceptResult = JSON.parse(accept);
        if (acceptResult.success) {
            setPendingStatus("requestAccepted");
        } else {
            setPendingStatus("unableToAccept");
        }
    };
    const handleReject = async (otherUser) => {
        let reject = await rejectRequest({
            recipientName: currentUser.displayName,
            senderName: otherUser,
        });
        resultResult = JSON.parse(reject);
        if (rejectResult.success) {
            setPendingStatus("requestRejected");
        } else {
            setPendingStatus("unableToReject");
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
                                            Friends List:{" "}
                                            {userData.friendList.length}
                                        </h3>
                                        <div className="ml-3 text-left flex justify-center items-center">
                                            <ul className="list-none break-all overflow-hidden">
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

                            <div>
                                {userData.sentRequests.length !== 0 ? (
                                    <div>
                                        <h3 className="underline font-bold text-lg">
                                            Sent Requests:{" "}
                                            {userData.sentRequests.length}
                                        </h3>
                                        <div className="ml-3 text-left flex justify-center items-center">
                                            <ul className="list-none break-all overflow-hidden">
                                                {userData.sentRequests &&
                                                    userData.sentRequests
                                                        .slice(
                                                            curSentPage * 10,
                                                            (curSentPage + 1) *
                                                                10
                                                        )
                                                        .map((sentReq, i) => {
                                                            return (
                                                                <li key={i}>
                                                                    <Link
                                                                        className="inline text-blue-700 hover:underline hover:font-bold"
                                                                        href={`/profile/${sentReq}`}
                                                                    >
                                                                        {
                                                                            sentReq
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                            </ul>
                                        </div>
                                        <div>
                                            {curSentPage === 0 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 mr-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={handlePrevSentPage}
                                                >
                                                    Prev
                                                </button>
                                            )}
                                            {curSentPage >=
                                            Math.ceil(
                                                userData.sentRequests.length /
                                                    10
                                            ) -
                                                1 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 ml-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={handleNextSentPage}
                                                >
                                                    Next
                                                </button>
                                            )}
                                            <h3 className="font-bold">
                                                Page {curSentPage + 1}/
                                                {Math.ceil(
                                                    userData.sentRequests
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
                                            Sent Requests:{" "}
                                            {userData.sentRequests.length}
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
                                            {userData.pendingRequests.length}
                                        </h3>
                                        <div className="ml-3 text-left flex justify-center items-center">
                                            <ul className="list-none break-all overflow-hidden">
                                                {userData.pendingRequests &&
                                                    userData.pendingRequests
                                                        .slice(
                                                            curPendPage * 10,
                                                            (curPendPage + 1) *
                                                                10
                                                        )
                                                        .map(
                                                            (pendingReq, i) => {
                                                                return (
                                                                    <li key={i}>
                                                                        <Link
                                                                            className="inline text-blue-700 hover:underline hover:font-bold"
                                                                            href={`/profile/${pendingReq}`}
                                                                        >
                                                                            {
                                                                                pendingReq
                                                                            }
                                                                        </Link>
                                                                        <button
                                                                            className="mt-4 ml-3 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                                            onClick={handleAccept(
                                                                                pendingReq
                                                                            )}
                                                                        >
                                                                            Accept
                                                                        </button>
                                                                        <button
                                                                            className="mt-4 ml-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                                            onClick={handleReject(
                                                                                pendingReq
                                                                            )}
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                            </ul>
                                        </div>
                                        <div>
                                            {curPendPage === 0 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 mr-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={handlePrevPendPage}
                                                >
                                                    Prev
                                                </button>
                                            )}
                                            {curPendPage >=
                                            Math.ceil(
                                                userData.pendingRequests
                                                    .length / 10
                                            ) -
                                                1 ? (
                                                <></>
                                            ) : (
                                                <button
                                                    className="mt-4 ml-1 bg-persian-blue text-white font-bold py-1 px-3 rounded"
                                                    onClick={handleNextPendPage}
                                                >
                                                    Next
                                                </button>
                                            )}
                                            <h3 className="font-bold">
                                                Page {curFriendPage + 1}/
                                                {Math.ceil(
                                                    userData.pendingRequests
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
                                            Pending Requests:{" "}
                                            {userData.pendingRequests.length}
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
