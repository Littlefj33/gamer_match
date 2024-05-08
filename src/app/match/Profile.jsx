import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { addFriend, getFriendStatus } from "./actions";

export default function Profile({ userData }) {
    const { currentUser } = useContext(AuthContext);
    const [friendStatus, setFriendStatus] = useState("");

    const handleAddFriend = async () => {
        let result = await addFriend({
            senderName: currentUser.displayName,
            recipientName: userData.username,
        });
        result = JSON.parse(result);
        if (result.success) {
            setFriendStatus("requestSent");
        } else {
            setFriendStatus("notFriend");
        }
    };

    useEffect(() => {
        async function getStatus() {
            let status = await getFriendStatus({
                username: currentUser.displayName,
                otherUsername: userData.username,
            });
            status = JSON.parse(status);

            if (status.isFriend) {
                setFriendStatus("friend");
            } else {
                if (status.requestSent) {
                    setFriendStatus("requestSent");
                } else {
                    setFriendStatus("notFriend");
                }
            }
        }
        getStatus();
    }, []);

    return (
        <div className="w-44 h-44 flex flex-col px-4 py-3 rounded-3xl bg-gradient-to-b from-tangerine to-bittersweet text-black">
            <div className="w-full flex justify-between items-center h-10 overflow-hidden py-4">
                <Link
                    href={`/profile/${userData.username}`}
                    className="text-m font-semibold"
                >
                    {userData.username}
                </Link>

                <Link
                    href={`/profile/${userData.username}`}
                    className="border border-black"
                >
                    <Image
                        src="/assets/profile_icon.png"
                        alt="Profile Icon"
                        width={30}
                        height={30}
                    />
                </Link>
            </div>

            {userData.achievements !== undefined ? (
                userData.achievements.length > 0 ? (
                    <div className="mt-3 overflow-y-scroll scrollbar">
                        <ul className="list-disc list-inside mr-3 break-all text-sm">
                            {userData.achievements.map((achievement, i) => {
                                return <li key={i}>{achievement}</li>;
                            })}
                        </ul>
                    </div>
                ) : (
                    <div>No Achievements Found</div>
                )
            ) : userData.playtime !== undefined ? (
                <div className="flex flex-col mt-3 items-center text-center">
                    <div className="justify-center items-center text-center text-lg font-semibold">
                        {userData.playtime > 99999999
                            ? ">99999999"
                            : userData.playtime}
                    </div>
                    <div className="justify-center items-center text-center text-sm">
                        Hours Played
                    </div>
                </div>
            ) : userData.gamesShared !== undefined ? (
                userData.gamesShared.length > 0 ? (
                    <div className="mt-3 overflow-y-scroll scrollbar">
                        <ul className="list-disc list-inside mr-3 break-all text-sm">
                            {userData.gamesShared.map((game, i) => {
                                return <li key={i}>{game}</li>;
                            })}
                        </ul>
                    </div>
                ) : (
                    <div>No Shared Games Found</div>
                )
            ) : (
                <div>ERROR: Could not get data</div>
            )}

            <div className="flex justify-end mt-2">
                {friendStatus === "notFriend" ? (
                    <button
                        onClick={handleAddFriend}
                        className="text-black font-medium"
                    >
                        + Add Friend
                    </button>
                ) : friendStatus === "friend" ? (
                    <Link
                        href="/friends"
                        className="text-black font-medium text-sm"
                    >
                        Friends! :)
                    </Link>
                ) : (
                    <Link
                        href="/friends"
                        className="text-black font-medium text-sm text-right"
                    >
                        Request Sent
                    </Link>
                )}
            </div>
        </div>
    );
}
