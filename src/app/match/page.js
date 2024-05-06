"use client";

import { useState } from "react";
import Profile from "./Profile";
import AchievementMatch from "@/lib/matching/AchievementMatch";
import HoursMatch from "@/lib/matching/HoursMatch";
import LibrariesMatch from "@/lib/matching/LibrariesMatch";

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
                                <AchievementMatch email="shinks@mail.com"/>
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
                                <HoursMatch email="shinks@mail.com"/>
                            ) : (
                                <></>
                            )}
                        </div>
                        <LibrariesMatch email="shinks@mail.com"/>
                    </div>
                </div>

            <Profile />
        </>
    );
}
