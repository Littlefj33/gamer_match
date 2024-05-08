import { sendFriendRequest, acceptFriendRequest } from "../data/friends.js";
import { linkSteamAccount, registerUser } from "../data/users.js";

export async function seedDatabase() {
    await registerUser("twang", "twang@mail.com", "Password123!!!!");
    await linkSteamAccount("twang@mail.com", "76561198061876066");
    console.log("1/5 Users Seeded");

    await registerUser("Aero", "aero@mail.com", "Password123!!!!");
    await linkSteamAccount("aero@mail.com", "76561198160939488");
    console.log("2/5 Users Seeded");

    await registerUser(
        "CausticLimes",
        "causticlimes@mail.com",
        "Password123!!!!"
    );
    await linkSteamAccount("causticlimes@mail.com", "76561198024306587");
    console.log("3/5 Users Seeded");

    await registerUser("Shinks", "shinks@mail.com", "Password123!!!!");
    await linkSteamAccount("shinks@mail.com", "76561198097969047");
    console.log("4/5 Users Seeded");

    await sendFriendRequest("twang", "Aero");
    await sendFriendRequest("twang", "CausticLimes");
    await sendFriendRequest("twang", "Shinks");
    await sendFriendRequest("Aero", "CausticLimes");
    console.log("Friend Requests Sent");

    await acceptFriendRequest("Aero", "twang");
    await acceptFriendRequest("CausticLimes", "twang");
    await acceptFriendRequest("Shinks", "twang");
    await acceptFriendRequest("CausticLimes", "Aero");
    console.log("Friend Requests Accepted");

    console.log("Program has been seeded successfully!");
}
