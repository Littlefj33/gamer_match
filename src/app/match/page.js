"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { achievementMatch } from "./actions";
import Profile from "./Profile";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function Match() {
    const { currentUser } = useContext(AuthContext);

    const [showAchieveForm, setShowAchForm] = useState(false);
    const [showHourForm, setShowHourForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [matchResults, setMatchResults] = useState([]);

    const handleShowForm = (type) => {
        switch (type) {
            case "achievements":
                setShowAchForm(!showAchieveForm);
                break;

            case "playtime":
                setShowHourForm(!showHourForm);
                break;

            default:
                break;
        }
    };

    const submitAchieveForm = async (e) => {
        e.preventDefault();
        let { matchType, gameName } = e.target;
        matchType = matchType.value;
        gameName = gameName.value;

        /**
         * TODO
         * - Client-side validation
         */

        try {
            setShowAchForm(false);
            setLoading(true);
            let result = await achievementMatch({
                userEmail: currentUser.email,
                matchType,
                gameName,
            });

            result = JSON.parse(result);
            setMatchResults([result, ...matchResults]);
            setLoading(false);
        } catch (e) {
            console.log("ERROR", e);
        }
    };

    useEffect(() => {
        console.log(matchResults);
    }, [matchResults]);

    /* TODO:
        - matchType for Achievements: [iAchieved, theyAchieved, neitherAchieved]
        - Edit backend for achievements to only return matchType results in user objects
    */

    if (!currentUser) {
        redirect("/auth/login");
    }

    return (
        <>
            {/* Main buttons & Forms */}
            <div className="w-full h-auto flex flex-wrap items-center justify-center text-white">
                <div className="mx-auto h-full min-h-24 flex flex-wrap justify-bewteen items-center">
                    <div className="w-40 h-full flex flex-wrap items-center justify-center text-center mx-10 relative">
                        <button
                            onClick={() => handleShowForm("achievements")}
                            className="w-40 h-12 flex items-center justify-center bg-persian-blue rounded-full text-xl"
                        >
                            Achievements
                        </button>

                        {showAchieveForm ? (
                            <form
                                onSubmit={submitAchieveForm}
                                className="w-full h-auto absolute top-full left-0 p-2 mt-2 z-10 rounded-lg text-black bg-white border border-black"
                            >
                                <div className="flex flex-col justify-center items-center text-center my-1">
                                    <label className="mb-4 font-semibold">
                                        Match Type:
                                        <input
                                            type="text"
                                            name="matchType"
                                            placeholder="e.g. I achieved"
                                            className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                        />
                                    </label>
                                    <label className="mb-4 font-semibold">
                                        Name of Game:
                                        <input
                                            type="text"
                                            name="gameName"
                                            placeholder="e.g. Minecraft"
                                            className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                        />
                                    </label>
                                    <button
                                        type="submit"
                                        className="w-20 bg-persian-blue rounded-full text-white"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="w-40 h-full flex flex-wrap items-center justify-center text-center mx-10 relative">
                        <button
                            onClick={() => handleShowForm("playtime")}
                            className="w-full h-12 flex items-center justify-center bg-persian-blue rounded-full text-xl "
                        >
                            Hours Played
                        </button>

                        {showHourForm ? (
                            <form className="w-full h-auto absolute top-full left-0 p-2 mt-2 z-10 rounded-lg text-black bg-white border border-black">
                                <div className="flex flex-col justify-center items-center text-center my-1">
                                    <label className="mb-4 font-semibold">
                                        Number of Hours:
                                        <input
                                            type="text"
                                            name="playtime"
                                            placeholder="e.g. 230"
                                            className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                        />
                                    </label>
                                    <label className="mb-4 font-semibold">
                                        Name of Game:
                                        <input
                                            type="text"
                                            name="gameName"
                                            placeholder="e.g. Minecraft"
                                            className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                        />
                                    </label>
                                    <button
                                        type="submit"
                                        className="w-20 bg-persian-blue rounded-full text-white"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="w-40 h-full flex flex-wrap items-center justify-center mx-10">
                        <button className="w-full h-12 flex items-center justify-center bg-persian-blue rounded-full text-xl ">
                            Shared Games
                        </button>
                    </div>
                </div>
            </div>

            {/* Matching results */}
            {loading ? (
                <div className="flex justify-center items-center text-center mx-10">
                    <div className="p-2 border-white bg-white rounded-full">
                        Loading...
                    </div>
                </div>
            ) : (
                <></>
            )}

            {matchResults.length > 0 ? (
                <div className="flex justify-center items-center">
                    <div className="w-5/6">
                        {matchResults.map((result, i) => {
                            return (
                                <div key={i}>
                                    <div className="flex justify-start items-center text-center mx-10">
                                        <div className="p-2 border-white bg-white rounded-full">
                                            results for: {result.gameName}
                                        </div>
                                    </div>
                                    {result.matchedUsers.length > 0 ? (
                                        <div>
                                            <div className="snap-x flex justify-start mx-10 overflow-x-scroll scrollbar">
                                                {result.matchedUsers.map(
                                                    (user, i) => {
                                                        return (
                                                            <div
                                                                key={i}
                                                                className="snap-start mx-5 my-5"
                                                            >
                                                                <Profile
                                                                    userData={
                                                                        user
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center text-center">
                                            No results found
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
