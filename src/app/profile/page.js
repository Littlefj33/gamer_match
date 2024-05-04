// "use client";

// import { useRouter } from 'next/router';
// import { useEffect} from 'react';

// export default function Profile() {
//     const router = useRouter();

//     useEffect(() => {
//       // Redirect to the dynamic route '/profile/[id]'
//       router.replace('/profile/[id]', '/profile/76561198024306587');
//     }, [router]);
  
//     return null; // Or any loading indicator if needed
//   };

import Header from "@/lib/header/header";

export default function Profile() {
    return (
        <>

            <div className="w-full h-screen text-black">
                <h1>Profile Page</h1>
            </div>
        </>
    );
}