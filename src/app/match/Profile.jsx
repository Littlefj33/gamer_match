import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { addFriend } from "./actions";

export default function Profile({ userData }) {
    const { currentUser } = useContext(AuthContext);
    const [friendStatus, setFriendStatus] = useState(""); // "friend", "pending", "notFriend"

    const handleAddFriend = async () => {
        setFriendStatus("pending");
        await addFriend(currentUser.email, userData.username);
        let success;
        if (success) {
            setFriendStatus("friend");
        } else {
            setFriendStatus("notFriend");
        }
    };

    /* TODO
        - Actual backend call to get friend status (remove hardcoded values)
        - Alter content of profile object based match type and its result
    */

    useEffect(() => {
        /* Hardcoded value */
        setFriendStatus("friend");
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

            <div className="mt-3 overflow-y-scroll scrollbar">
                <ul className="list-disc list-inside break-all mr-3">
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                </ul>
            </div>

            <div className="flex justify-end mt-2">
                {friendStatus === "notFriend" ? (
                    <button
                        onClick={() => {
                            handleAddFriend;
                        }}
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
