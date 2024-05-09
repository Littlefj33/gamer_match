import { registerUser, linkSteamAccount } from "../data/users.js";
import { closeConnection, dbConnection } from '../config/mongoConnection.js';

import {
    getSteamUser,
    getSteamUsersGames,
    getRecentlyPlayed,
    getTopFiveGames,
    getUserOwnedGame,
    getPlayerAchievmentsForGame
} from "../data/steam.js";
import {
    sendFriendRequest,
    acceptFriendRequest
} from "../data/friends.js";


const main = async () => {
    try {
        const db = await dbConnection();
        await db.dropDatabase();
      } catch (e) {
        console.log(e);
      }

      await client.flushAll('ASYNC');
    
    await registerUser("twang", "twang@mail.com", "Password123!!!!");
    await linkSteamAccount("twang@mail.com", "76561198061876066");
    await getSteamUser("76561198061876066");
    await getSteamUsersGames("twang@mail.com");
    await getRecentlyPlayed("twang@mail.com");
    await getTopFiveGames("twang@mail.com");
    await getUserOwnedGame("twang@mail.com", "Nidhogg");
    await getPlayerAchievmentsForGame("twang@mail.com", "Nidhogg");
    console.log("1/5 Users Seeded");

    await registerUser("Aero", "aero@mail.com", "Password123!!!!");
    await linkSteamAccount("aero@mail.com", "76561198160939488");
    await getSteamUser("76561198160939488");
    await getSteamUsersGames("aero@mail.com");
    await getRecentlyPlayed("aero@mail.com");
    await getTopFiveGames("aero@mail.com");
    console.log("2/5 Users Seeded");

    await registerUser("CausticLimes", "causticlimes@mail.com", "Password123!!!!");
    await linkSteamAccount("causticlimes@mail.com", "76561198024306587");
    await getSteamUser("76561198024306587");
    await getSteamUsersGames("causticlimes@mail.com");
    await getRecentlyPlayed("causticlimes@mail.com");
    await getTopFiveGames("causticlimes@mail.com");
    console.log("3/5 Users Seeded");

    await registerUser("Shinks", "shinks@mail.com", "Password123!!!!");
    await linkSteamAccount("shinks@mail.com", "76561198097969047");
    await getSteamUser("76561198097969047");
    await getSteamUsersGames("shinks@mail.com");
    await getRecentlyPlayed("shinks@mail.com");
    await getTopFiveGames("shinks@mail.com");
    console.log("4/5 Users Seeded");

    // has no recently played games, so the function will throw an error if this is run
    // await registerUser("LackofAIR22", "lackofair22@mail.com", "Password123!!!!");
    // await linkSteamAccount("lackofair22@mail.com", "76561198226833264");
    // await getSteamUser("76561198226833264");
    // await getSteamUsersGames("lackofair22@mail.com");
    // await getRecentlyPlayed("lackofair22@mail.com");
    // await getTopFiveGames("lackofair22@mail.com");
    // console.log("5/5 Users Seeded");

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
    await closeConnection();
    process.exit();
};

main().catch((error) => {
    console.log(error);
    process.exit();
});
