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
    getTopFiveGames
} from "../actions";

export default function Register() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isLinked, setIsLinked] = useState(false);
    const [IdError, setIdError] = useState({});
    const [serverError, setServerError] = useState({});

    const linkStatus = async () => {
        try {
            setLoading(true);
            let emailAddress = currentUser.email;
            let mongoResponse = await isAccountLinked({ emailAddress });
            await setIsLinked(mongoResponse);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    };

    useEffect(() => {
        linkStatus();
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
            await unlinkSteamAccount({ emailAddress });
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    };

    if (!currentUser) {
        redirect("/");
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {isLinked ? (
                <form onSubmit={handleUnlink}>
                    <button id="unlinkButton" type="submit">
                        Unlink Steam Account
                    </button>
                </form>
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
