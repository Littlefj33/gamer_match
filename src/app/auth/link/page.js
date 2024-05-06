"use client";
import { stringCheck, emailValidation } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
    linkSteamAccount,
    unlinkSteamAccount,
    isAccountLinked,
} from "../actions";

export default function Register() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [errorObj, setErrorObj] = useState({});
    const [isLinked, setIsLinked] = useState(false);

    const linkStatus = async () => {
        let emailAddress = currentUser.email;
        let emailAddressValidation = emailValidation(emailAddress);
        if (emailAddressValidation.isValid == false) {
            setErrorObj(emailAddressValidation.errors);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let mongoResponse = await isAccountLinked({ emailAddress });
            if (mongoResponse.success == false) {
                setErrorObj({ 0: mongoResponse.error });
                setLoading(false);
                return;
            }
            setIsLinked(mongoResponse);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    }

    useEffect(() => {
        linkStatus();
    }, []);

    const handleLink = async (e) => {
        e.preventDefault();
        let { steamId } = e.target;

        steamId = steamId.value;
        let emailAddress = currentUser.email;

        let steamIdValidation = stringCheck(steamId);
        if (steamIdValidation.isValid == false) {
            setErrorObj(steamIdValidation.errors);
            setLoading(false);
            return;
        }

        let emailAddressValidation = emailValidation(emailAddress);
        if (emailAddressValidation.isValid == false) {
            setErrorObj(emailAddressValidation.errors);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let mongoResponse = await linkSteamAccount({
            emailAddress,
            steamId,
            });
            if (mongoResponse.success == false) {
            setErrorObj({ 0: mongoResponse.error });
            setLoading(false);
            return;
            }
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

        let emailAddressValidation = emailValidation(emailAddress);
        if (emailAddressValidation.isValid == false) {
            setErrorObj(emailAddressValidation.errors);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let mongoResponse = await unlinkSteamAccount({ emailAddress });
            if (mongoResponse.success == false) {
                setErrorObj({ 0: mongoResponse.error });
                setLoading(false);
                return;
            }
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

            {Object.keys(errorObj).length !== 0 ? (
                <div className="text-red-500">
                    <h2>ERROR:</h2>
                    <ul>
                        {Object.keys(errorObj).map((key, i) => {
                            return (
                                <li key={i}>
                                    {key}: {errorObj[key]}
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
