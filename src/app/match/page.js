"use client";

import { useState } from "react";
import Profile from "./Profile";

export default function Match() {
    const [showAchieveForm, setShowAchForm] = useState(false);
    const [showHourForm, setShowHourForm] = useState(false);

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

    return (
        <>
            <div className="w-full h-screen bg-platinum text-black">
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
                                <form className="w-full h-auto absolute top-full left-0 p-2 mt-2 z-10 rounded-lg text-black bg-white border border-black">
                                    <div className="flex flex-col justify-center items-center text-center my-1">
                                        <label className="mb-4 font-semibold">
                                            Match Type:
                                            <input
                                                type="text"
                                                placeholder="e.g. I achieved"
                                                className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                            />
                                        </label>
                                        <label className="mb-4 font-semibold">
                                            Name of Game:
                                            <input
                                                type="text"
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
                                                placeholder="e.g. 230"
                                                className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                            />
                                        </label>
                                        <label className="mb-4 font-semibold">
                                            Name of Game:
                                            <input
                                                type="text"
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

                <Profile />
            </div>
        </>
    );
}
