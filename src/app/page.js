"use client";
import Header from "@/lib/header/header";
import React, { useEffect, useState } from "react";
import { getTrending } from "./action";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [trendingGames, setTrendingGames] = useState({});
    const [sortedArrOfPopGames, setArrOfPopGames] = useState([]);
    const [curTrendPage, setTrendPage] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                let games = await getTrending();
                games = JSON.parse(games);

                const arrOfGames = Object.keys(games);

                arrOfGames.sort((a, b) => {
                    games[b] - games[a];
                });

                setArrOfPopGames(arrOfGames);
                setTrendingGames(games);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, []);

    const handlePrevTrendPage = () => {
        if (curTrendPage > 0) {
            setTrendPage(curTrendPage + 1);
        }
    };
    const handleNextTrendPage = () => {
        if (curTrendPage < Math.ceil(trendingGames.length / 10) - 1) {
            setTrendPage(curTrendPage - 1);
        }
    };

    if (loading) {
        return (
            <div>
                <h2>Loading Gamer Match...</h2>
            </div>
        );
    } else {
        return (
            <>
                <Header />

                <div className="w-full min-h-screen bg-platinum text-black">
                    <div className="items-center justify-center">
                        <div>
                            <h1 className="text-center text-3xl font-bold mb-6 text-persian-blue">
                                Gamer Match
                            </h1>
                        </div>
                        <div className="flex justify-evenly text-center">
                            <div className="w-1/2">
                                <h2 className="text-center mb-6 text-persian-blue text-lg font-medium">
                                    Never game alone again with Gamer Match!
                                    This matching application connects you with
                                    fellow gamers based on multiple stats.
                                </h2>
                            </div>
                            <div className="w-1/2">
                                <h2 className="text-center mb-6 text-persian-blue text-lg font-medium">
                                    Find gamers who play the same games during
                                    similar hours as you, are comparable skill
                                    levels, and are hunting for the same
                                    achievement.
                                </h2>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-center mb-6 text-persian-blue text-lg font-medium">
                                Connect your Steam account today and find your
                                perfect Gamer Match!
                            </h2>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-center text-3xl font-medium text-persian-blue">
                            Trending Games
                        </h3>
                        <p className="text-center font-light text-sm">
                            (Name of Game : Number of Players)
                        </p>
                        <ul className="list-disc list-inside break-all overflow-hidden">
                            {sortedArrOfPopGames &&
                                sortedArrOfPopGames.map((game, i) => {
                                    if (i === 0) {
                                        return (
                                            <div
                                                key={i}
                                                className="text-center text-2xl font-semibold text-yellow-500"
                                            >
                                                {game}: {trendingGames[game]}
                                            </div>
                                        );
                                    } else if (i === 1) {
                                        return (
                                            <div
                                                key={i}
                                                className="text-xl justify-center font-medium text-center text-gray-500"
                                            >
                                                {game}: {trendingGames[game]}
                                            </div>
                                        );
                                    } else if (i === 2) {
                                        return (
                                            <div
                                                key={i}
                                                className="text-l justify-center font-medium text-center text-orange-800"
                                            >
                                                {game}: {trendingGames[game]}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={i}
                                                className="text-base justify-center text-center font-light"
                                            >
                                                {game}: {trendingGames[game]}
                                            </div>
                                        );
                                    }
                                })}
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}
