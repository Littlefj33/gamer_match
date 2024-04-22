import Link from "next/link";

export default function Header() {
    return (
        <div className="w-full h-16 flex flex-wrap items-center justify-center bg-white z-30 text-white">
            <div className="mx-auto h-10 flex flex-wrap justify-center items-center">
                <Link href={"/"} className="h-full">
                    <div className="w-40 h-full text-center border-r border-black hover:bg-blue-100">
                        Home
                    </div>
                </Link>
                <Link href={"/friends"} className="h-full">
                    <div className="w-40 h-full text-center border-r border-black hover:bg-blue-100">
                        My Friends
                    </div>
                </Link>
                <Link href={"/match"} className="h-full">
                    <div className="w-40 h-full text-center border-r border-black hover:bg-blue-100">
                        Match
                    </div>
                </Link>
                <Link href={"/profile"} className="h-full">
                    <div className="w-40 h-full text-center border-r border-black hover:bg-blue-100">
                        Profile
                    </div>
                </Link>
                <Link href={"/auth/login"} className="h-full">
                    <div className="w-40 h-full text-center border-r border-black hover:bg-blue-100">
                        Login
                    </div>
                </Link>
                <Link href={"/auth/register"} className="h-full">
                    <div className="w-40 h-full text-center border-r border-black hover:bg-blue-100">
                        Register
                    </div>
                </Link>
            </div>
        </div>
    );
}
