import React from "react";
import { doSocialSignIn } from "../../firebase/FirebaseFunctions";

const SocialSignIn = () => {
    const socialSignOn = async () => {
        try {
            await doSocialSignIn();
        } catch (error) {
            alert(error);
        }
    };
    return (
        <img
            onClick={() => socialSignOn()}
            alt="google signin"
            src="/imgs/btn_google_signin.png"
        />
    );
};

export default SocialSignIn;
