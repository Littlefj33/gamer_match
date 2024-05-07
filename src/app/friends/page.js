"use client";
import Link from "next/link";
import AcceptButton from "@/lib/friendButton/AcceptButton";
import RejectButton from "@/lib/friendButton/RejectButton";
import React, { useContext, useEffect, useState } from "react";
import { getUser, getRequests } from "./actions";
import { AuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function MyFriends() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [pendingReqs, setPendingReqs] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getUser(currentUser.username);
                const pendingReqs = await getRequests(
                    currentUser.username,
                    currentUser.sentRequests,
                    currentUser.sentRequests.username,
                    currentUser.pendingRequests
                );
                console.log(JSON.parse(result));
                setUserData(JSON.parse(result));
                setPendingReqs(JSON.parse(pendingReqs));
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

    //what is the difference between sent requests and pending requests
    //what is the info that is stored within each array

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
                        <h1 className="text-center text-3xl font-bold mb-6 text-persian-blue">
                            Friends
                        </h1>

                        <div>
                            {userData.friendList.length !== 0 ? (
                                <div>
                                    <h3 className="underline font-bold text-lg">
                                        Friends List: {userData.friendCount}
                                    </h3>
                                    <ul>
                                        {userData.friendList.map(
                                            (friend, i) => {
                                                return (
                                                    <li key={i}>
                                                        <Link
                                                            href={
                                                                friend.username
                                                            }
                                                        >
                                                            {friend.username}
                                                        </Link>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
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
                            <ul>
                                {pendingReqs.map((name, index) => (
                                    <li key={index}>
                                        <p>
                                            Pending friend request from {name}
                                        </p>
                                        <AcceptButton
                                            recipient={userData.username}
                                            sender={name}
                                        />
                                        <RejectButton
                                            recipient={userData.username}
                                            sender={name}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <h1>Not signed in</h1>
                )}
            </div>
        );
    }
}
