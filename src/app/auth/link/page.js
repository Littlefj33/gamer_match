"use client";
import { stringCheck } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
    linkSteamAccount,
    unlinkSteamAccount,
    isAccountLinked,
    getSteamUsersGames,
    getRecentlyPlayed,
    getTopFiveGames,
    deleteUserData,
    getSteamId,
} from "../actions";

export default function Register() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isLinked, setIsLinked] = useState(false);
    const [IdError, setIdError] = useState({});
    const [serverError, setServerError] = useState({});
    const [steamId, setSteamId] = useState("");

    const linkStatus = async () => {
        try {
            setLoading(true);
            let emailAddress = currentUser.email;
            let mongoResponse = await isAccountLinked({ emailAddress });
            setIsLinked(mongoResponse);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error); // TODO Present error as text on page instead of alerting
        }
    };

    useEffect(() => {
        linkStatus();
        try {
            const result = getSteamId({ username: currentUser.displayName });
            if (result.success) {
                setSteamId(result.steamId);
            } else {
                setSteamId("");
            }
        } catch (e) {
            console.log(e);
        } // TODO HERE
    }, []);

    const handleLink = async (e) => {
        e.preventDefault();
        let { steamId } = e.target;

        steamId = steamId.value;
        let emailAddress = currentUser.email;

        let IdStatus = stringCheck(steamId);
        if (IdStatus.isValid == false) {
            setIdError({ steamId: IdStatus.errors.message });
            return;
        }

        try {
            setLoading(true);
            let mongoResponse = await linkSteamAccount({
                emailAddress,
                steamId,
            });
            if (mongoResponse.success == false) {
                setServerError({ 0: mongoResponse.error });
                setLoading(false);
                return;
            }
            await getSteamUsersGames({ emailAddress });
            await getRecentlyPlayed({ emailAddress });
            await getTopFiveGames({ emailAddress });
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    };

    const handleUnlink = async (e) => {
        e.preventDefault();
        let emailAddress = currentUser.email;

        try {
            setLoading(true);
            await deleteUserData({ emailAddress });
            await unlinkSteamAccount({ emailAddress });
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    };

    if (!currentUser) {
        redirect("/auth/login");
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center text-center mx-10">
                <div className="p-2 border-white bg-white rounded-full">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div>
            {isLinked ? (
                <div className="flex flex-col text-center text-black text-base">
                    <h1>Your account is already linked to a Steam account!</h1>
                    <h2>
                        Current Steam Id:
                        <h3 className="ml-1 font-semibold">{steamId}</h3>
                    </h2>
                    <h2>
                        If you would like to unlink, please press "Unlink Steam
                        Account" below.
                    </h2>
                    <button
                        className="mt-4 bg-persian-blue text-white font-bold py-1 px-3 rounded-full"
                        onClick={handleUnlink}
                    >
                        Unlink Steam Account
                    </button>
                </div>
            ) : (
                <form onSubmit={handleLink}>
                    <div>
                        <label>
                            Steam ID:
                            <input
                                required
                                name="steamId"
                                type="text"
                                placeholder="Steam ID"
                                autoFocus={true}
                            />
                        </label>
                    </div>
                    <button id="submitButton" type="submit">
                        Link Steam Account
                    </button>
                </form>
            )}

            {Object.keys(IdError).length !== 0 ? (
                <div className="text-red-500">
                    <h2>ERROR:</h2>
                    <ul>
                        {Object.keys(IdError).map((key, i) => {
                            return (
                                <li key={i}>
                                    {key}: {IdError[key]}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <></>
            )}

            {Object.keys(serverError).length !== 0 ? (
                <div className="text-red-500">
                    <h2>ERROR:</h2>
                    <ul>
                        {Object.keys(serverError).map((key, i) => {
                            return (
                                <li key={i}>
                                    {key}: {serverError[key]}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
