import Image from "next/image";
import React from "react";
import { doSocialSignIn } from "@/utils/firebase/FirebaseFunctions";

const SocialSignIn = () => {
    const socialSignOn = async () => {
        try {
            await doSocialSignIn();
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };
    return (
        <Image
            onClick={() => socialSignOn()}
            alt="Google Signin"
            src="/assets/btn_google_signin.png"
            width={200}
            height={200}
        />
    );
};

export default SocialSignIn;
