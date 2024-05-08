import {getUserByUsername} from '/backend/helpers.js';
import Link from 'next/link';

export default async function MyFriends() {

    //TODO: Obtain username from session. Currently hardcoded until auth is implemented.
    const data = await getData("shinks");
    const friendList = data.friendList;
    const pendingRequests = data.pendingRequests;
    console.log(pendingRequests);

    let friendUsernames = [];

    for (let i = 0; i < friendList.length; i++) {
        friendUsernames.push(friendList[i].username);
    }
    console.log(friendList);
    console.log(friendUsernames);
    return (
        <>
            <div className="w-full h-screen bg-sky-100 text-black">
                <h1>My Friends Page</h1>
                <ul>
                    {friendUsernames.map((name, index) => (
                        <li key={index}>
                            <Link href={`/profile/${friendUsernames[index]}`} passHref>
                            {name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul>
                    {pendingRequests.map((name, index) => (
                        <li key={index}>
                            <p>Pending friend request from {name}</p>
                            <AcceptButton recipient={"shinks"} sender={name}/>
                            <RejectButton recipient={"shinks"} sender={name}/>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );

    async function getData(username) {
        const user = await getUserByUsername(username);
        return user;
      }
}
