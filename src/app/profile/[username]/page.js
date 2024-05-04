//"use client";

import {getSteamUser} from '/backend/data/steam.js';
import { isFriendOrPending, sendFriendRequest } from '/backend/data/friends.js';
import { getUserByUsername } from '/backend/helpers';
import Link from 'next/link';
import Image from 'next/image';
import SendFriendRequestButton from '@/lib/friendButton/SendButton';
//import {useState, useEffect} from 'react';


export default async function Profile({params}) {
    try {
        const data = await getData(params.username);
        const steamDisplayname = data.steamAccountUsername;
        let areFriends = undefined;

        //TODO: Replace with session id. Hard coded to specific value right now
        const isOwnProfile = params.username === "shinks";
        if (!isOwnProfile) {
            areFriends = await checkFriendStatus("shinks", params.username)
        }

        return (
        <>
            <div className="w-full h-screen bg-sky-100 text-black">
                <h1>Profile Page</h1>
                <div>User ID: {data.steamId.toString()}</div>
                <div>Steam Username: {steamDisplayname.toString()}</div>
                <div>User Profile URL: {data.steamProfileLink.toString()}</div>
            </div>
            {/* {!isOwnProfile && (
               <FriendButton
                isFriend={areFriends}
                onClick={handleSendFriendRequest}
               />
            )} */}
        </>
    );
    } catch (e) {
    return <div>{e}</div>
}

    async function getData(username) {
        const user = await getUserByUsername(username);
        return user;
      };

    async function checkFriendStatus(senderName, recipientName) {
        return await isFriendOrPending(senderName, recipientName)
    }

}
