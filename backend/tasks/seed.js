import { registerUser, linkSteamAccount } from "../data/users.js";
import {
    getSteamUser,
    getSteamUsersGames,
    getRecentlyPlayed,
    getTopFiveGames,
    getUserOwnedGame,
    getPlayerAchievmentsForGame
} from "../data/steam.js";

const main = async () => {
    // await registerUser("Scribble", "Scribble@mail.com", "Password123!!!!");
    // await registerUser("Aero", "Aero@mail.com", "Password123!!!!");
    // await registerUser("LittleFJ", "LittleFJ@mail.com", "Password123!!!!");
    // await registerUser("wackyjackie11", "wackyjackie11@mail.com", "Password123!!!!");
    // console.log("Done adding users");
    // console.log("Done linking steam account");
    await registerUser("twang", "twang@mail.com", "Password123!!!!");
    await linkSteamAccount("twang@mail.com", "76561198061876066");
    await getSteamUser("76561198061876066");
    await getSteamUsersGames("twang@mail.com");
    await getRecentlyPlayed("twang@mail.com");
    await getTopFiveGames("twang@mail.com");
    await getUserOwnedGame("twang@mail.com", "Among Us");
    await getPlayerAchievmentsForGame("twang@mail.com", "Among Us");

    process.exit();
};

main().catch((error) => {
    console.log(error);
    process.exit();
});
