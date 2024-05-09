"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
    achievementMatch,
    generateAutoMatches,
    libraryMatch,
    playtimeMatch,
    isAccountLinked,
} from "./actions";
import { stringCheck } from "@/utils/helpers";
import Profile from "./Profile";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Match() {
    const { currentUser } = useContext(AuthContext);
    const [showAchieveForm, setShowAchForm] = useState(false);
    const [showPlaytimeForm, setShowPlaytimeForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [matchResults, setMatchResults] = useState([]);
    const [linkedStatus, setLinkedStatus] = useState(false);

    const [gameNameMatchError, setGameNameMatchError] = useState({});
    const [gameNameTimeError, setGameNameTimeError] = useState({});
    const [serverError, setServerError] = useState({});

    const handleShowForm = (type) => {
        switch (type) {
            case "achievements":
                setShowAchForm(!showAchieveForm);
                break;

            case "playtime":
                setShowPlaytimeForm(!showPlaytimeForm);
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

        let gameNameStatus = stringCheck(gameName);
        if (gameNameStatus.validString == false) {
            setGameNameMatchError({ gameName: gameNameStatus.errors.message });
            return;
        } else {
            setGameNameMatchError({});
        }

        try {
            setShowAchForm(false);
            setShowPlaytimeForm(false);
            setLoading(true);
            let result = await achievementMatch({
                userEmail: currentUser.email,
                matchType,
                gameName,
            });
            if (result.error) {
                setServerError(result.error);
                setLoading(false);
                return;
            }

            setServerError({});
            result = JSON.parse(result);
            addMatchResult(result);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    const submitPlaytimeForm = async (e) => {
        e.preventDefault();
        let { gameName } = e.target;
        gameName = gameName.value;

        let gameNameStatus = stringCheck(gameName);
        if (gameNameStatus.validString == false) {
            setGameNameTimeError({ gameName: gameNameStatus.errors.message });
            return;
        }

        try {
            setShowPlaytimeForm(false);
            setShowAchForm(false);
            setLoading(true);
            let result = await playtimeMatch({
                userEmail: currentUser.email,
                gameName,
            });
            if (result.error) {
                setServerError(result.error);
                setLoading(false);
                return;
            }

            setServerError({});
            result = JSON.parse(result);
            addMatchResult(result);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    const handleMatchLibrary = async () => {
        try {
            setLoading(true);
            let result = await libraryMatch({
                userEmail: currentUser.email,
            });

            result = JSON.parse(result);
            addMatchResult(result);
            setLoading(false);
        } catch (e) {
            console.log("ERROR", e);
        }
    };

    const handleShowMore = async (type, index) => {
        switch (type) {
            case "history":
                break;

            case "match":
                break;

            default:
                break;
        }
    };

    const addMatchResult = async (result) => {
        // check if result is in list already, if so move to front of array
        const search = { duplicate: false, index: -1 };
        for (let i = 0; i < matchResults.length; i++) {
            const elem = matchResults[i];
            if (result.type === "achievements") {
                if (
                    elem.type === result.type &&
                    elem.gameName === result.gameName &&
                    elem.matchType === result.matchType
                ) {
                    search.duplicate = true;
                    search.index = i;
                }
            } else if (result.type === "playtime") {
                if (
                    elem.type === result.type &&
                    elem.gameName === result.gameName
                ) {
                    search.duplicate = true;
                    search.index = i;
                }
            } else if (result.type === "library") {
                if (elem.type === result.type) {
                    search.duplicate = true;
                    search.index = i;
                }
            } else {
                console.log("ERROR: Invalid result type (Add match result)");
            }
        }
        if (search.duplicate) {
            const removedValArr = matchResults.splice(search.index, 1);
            setMatchResults(removedValArr.concat(matchResults));
        } else {
            setMatchResults([result, ...matchResults]);
        }
    };

    useEffect(() => {
        async function autoGenerate() {
            let autoResults = await generateAutoMatches({
                userEmail: currentUser.email,
            });
            autoResults = JSON.parse(autoResults);
            setMatchResults(autoResults);
        }
        linkStatus();
        if (linkedStatus) {
            autoGenerate();
        }
    }, [linkedStatus]);

    const linkStatus = async () => {
        try {
            setLoading(true);
            let emailAddress = currentUser.email;
            let mongoResponse = await isAccountLinked({ emailAddress });
            setLinkedStatus(mongoResponse);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    };

    if (!currentUser) {
        redirect("/auth/login");
    }

    if (!linkedStatus) {
        return (
            <div className="flex justify-center items-center text-center">
                <div>
                    <div className="text-2xl font-semibold">
                        You must link your Steam account to use this feature
                    </div>
                    <div className="text-lg">
                        <Link href="/profile">
                            Click here to link your account within Profile page
                        </Link>
                    </div>
                </div>
            </div>
        );
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
                                        <select
                                            name="matchType"
                                            className="w-full bg-transparent shadow-md border-b border-t border-black"
                                        >
                                            <option value="iAchieved">
                                                I achieved
                                            </option>
                                            <option value="theyAchieved">
                                                They achieved
                                            </option>
                                            <option value="neitherAchieved">
                                                Neither achieved
                                            </option>
                                        </select>
                                    </label>
                                    <label className="mb-4 font-semibold">
                                        Name of Game:
                                        <input
                                            type="text"
                                            name="gameName"
                                            placeholder="e.g. Among Us"
                                            className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                        />
                                    </label>
                                    {Object.keys(gameNameMatchError).length !==
                                    0 ? (
                                        <div className="text-red-500">
                                            <h2>ERROR:</h2>
                                            <ul>
                                                {Object.keys(
                                                    gameNameMatchError
                                                ).map((key, i) => {
                                                    return (
                                                        <li key={i}>
                                                            {key}:{" "}
                                                            {
                                                                gameNameMatchError[
                                                                    key
                                                                ]
                                                            }
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
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

                        {showPlaytimeForm ? (
                            <form
                                onSubmit={submitPlaytimeForm}
                                className="w-full h-auto absolute top-full left-0 p-2 mt-2 z-10 rounded-lg text-black bg-white border border-black"
                            >
                                <div className="flex flex-col justify-center items-center text-center my-1">
                                    <label className="mb-4 font-semibold">
                                        Name of Game:
                                        <input
                                            type="text"
                                            name="gameName"
                                            placeholder="e.g. Doom"
                                            className="w-full bg-transparent shadow-md border-b border-t border-black placeholder:text-gray-400 placeholder:font-normal px-2"
                                        />
                                    </label>
                                    <button
                                        type="submit"
                                        className="w-20 bg-persian-blue rounded-full text-white"
                                    >
                                        Search
                                    </button>
                                    {Object.keys(gameNameTimeError).length !==
                                    0 ? (
                                        <div className="text-red-500">
                                            <h2>ERROR:</h2>
                                            <ul>
                                                {Object.keys(
                                                    gameNameTimeError
                                                ).map((key, i) => {
                                                    return (
                                                        <li key={i}>
                                                            {key}:{" "}
                                                            {
                                                                gameNameTimeError[
                                                                    key
                                                                ]
                                                            }
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="w-40 h-full flex flex-wrap items-center justify-center mx-10">
                        <button
                            onClick={handleMatchLibrary}
                            className="w-full h-12 flex items-center justify-center bg-persian-blue rounded-full text-xl "
                        >
                            Shared Games
                        </button>
                    </div>
                </div>
            </div>

            {serverError && serverError.length > 0 ? (
                <div className="text-red-500">
                    <h2>ERROR:</h2>
                    <p>{serverError}</p>
                </div>
            ) : null}

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
                                        <div className="text-black font-bold text-lg">
                                            {result.type === "achievements"
                                                ? result.matchType ===
                                                  "iAchieved"
                                                    ? `I earned achievements users did not for: ${result.gameName}`
                                                    : result.matchType ===
                                                      "theyAchieved"
                                                    ? `User earned achievements I did not for: ${result.gameName}`
                                                    : `Neither earned achievements for: ${result.gameName}`
                                                : result.type === "playtime"
                                                ? `Similar Hours Played on: ${result.gameName}`
                                                : "Shared Library of Games"}
                                        </div>
                                    </div>
                                    {result.matchedUsers &&
                                    result.matchedUsers.length > 0 ? (
                                        <div>
                                            <div className="flex justify-start mx-10 overflow-x-auto scrollbar">
                                                {result.matchedUsers.map(
                                                    (user, i) => {
                                                        return (
                                                            <div
                                                                key={i}
                                                                className="mx-5 my-5"
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
