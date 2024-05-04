import Image from "next/image";
import Link from "next/link";
import SendButton from "@/lib/friendButton/SendButton";

export default function Profile({sender, recipient}) {
    let achievements 
    return (
        <div className="w-44 h-44 flex flex-col px-4 py-3 rounded-3xl bg-gradient-to-b from-tangerine to-bittersweet text-black">
            <div className="w-full flex justify-between items-center h-10 overflow-hidden">
                <div className="text-m font-semibold"></div>

                <Link href="/profile" className="border border-black">
                    <Image
                        src="/assets/profile_icon.png"
                        alt="Profile Icon"
                        width={30}
                        height={30}
                    />
                </Link>
            </div>

            <div className="mt-3 flex-grow ">
                <ul>
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                    <li className="text-xs">Name of Achievement...</li>
                </ul>
            </div>

            <div className="flex justify-end">
                <SendButton sender="aero" recipient = "shinks"/>
            </div>
        </div>
    );
}
