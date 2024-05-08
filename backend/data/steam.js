import axios from "axios";
import {
    ResourcesError,
    handleErrorChecking,
    setDbInfo,
    retrieveGamesOwnedFromDb,
    getDbInfo,
} from "../helpers.js";
import { createClient } from "redis";
import { users } from "../config/mongoCollections.js";
import validation from "../helpers.js";
const API_KEY = process.env.STEAM_API_KEY;

export const updateUserSteamInfo = async (emailAddress) => {
    emailAddress = validation.emailValidation(emailAddress);
    await getSteamUsersGames(emailAddress);
    await getTopFiveGames(emailAddress);
    await getRecentlyPlayed(emailAddress);

    return "Succesfully updated user's Steam Data";
};

//Function to check if a steam user exists and returns their profile data
export const convertVanityUrl = async (customId) => {
    customId = validation.stringCheck(customId);
    try {
        const response = await axios.get(
            `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${customId}`
        );
        if (response.status === 200) {
            const returnId = response.data.response.steamid;
            return returnId;
        }
    } catch (e) {
        throw new ResourcesError("Custom Id does not exist");
    }
    return;
};
export const getSteamUser = async (steamId) => {
    steamId = validation.stringCheck(steamId);
    const checkId = parseInt(steamId);
    if (isNaN(checkId)) {
        steamId = await convertVanityUrl(steamId);
    }
    try {
        const client = createClient();
        await client.connect();
        const cacheExists = await client.exists("User Data: " + steamId);
        if (cacheExists) {
            const userGameData = await client.get("User Data: " + steamId);
            return JSON.parse(userGameData);
        }
        const response = await axios.get(
            `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${steamId}`
        );
        if (response.status === 200) {
            const data = response.data;
            if (data.response.players.length === 0) {
                throw new ResourcesError(
                    "Error: Steam account not found (Make sure you are not using a custom steamURL and you use your ID number"
                );
            } else {
                const playerData = data.response.players[0];
                await client.set(
                    "User Data: " + steamId,
                    JSON.stringify(playerData)
                );
                await client.expire("User Data: " + steamId, 1800); //set expire time to half hour in case user changes profile data
                return playerData;
            }
        }
    } catch (e) {
        throw new ResourcesError("Steam account does not exist");
    }
};

//Function that gets all games a steam user owns
export const getSteamUsersGames = async (emailAddress) => {
    emailAddress = validation.emailValidation(emailAddress);
    const dbInfo = await handleErrorChecking(emailAddress);
    const user = dbInfo.user;
    const steamId = user.steamId;
    try {
        const client = createClient();
        await client.connect();
        const cacheExists = await client.exists("Games Owned: " + steamId);
        if (cacheExists) {
            const userGameData = await client.get("Games Owned: " + steamId);
            user.gamesOwned = JSON.parse(userGameData);
            await setDbInfo(emailAddress, user);
            return JSON.parse(userGameData);
        }
        const response = await axios.get(
            `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamId}&include_played_free_games=true&include_appinfo=true&format=json`
        );
        if (response.status === 200) {
            const data = response.data;
            if (data.response.games.length === 0) {
                throw new ResourcesError(
                    "Steam account does not have any games!"
                );
            } else {
                const userGameData = data.response.games;
                if (
                    JSON.stringify(userGameData) ===
                    JSON.stringify(user.gamesOwned)
                ) {
                    const user = await getDbInfo(emailAddress);
                    await client.set(
                        "Games Owned: " + steamId,
                        JSON.stringify(user.gamesOwned)
                    );
                    await client.expire("Games Owned: " + steamId, 1800); //set half hour expire time in case a user buys new games
                    return user.gamesOwned;
                } else {
                    user.gamesOwned = userGameData;
                    user.gamesOwnedCount = userGameData.length;
                    await setDbInfo(emailAddress, user);
                    await client.set(
                        "Games Owned: " + steamId,
                        JSON.stringify(userGameData)
                    );
                    await client.expire("Games Owned: " + steamId, 1800); //set half hour expire time in case a user buys new games
                    return userGameData;
                }
            }
        }
    } catch (e) {
        console.log(e);
        throw new ResourcesError("Error fetching steam account games");
    }
};

//Function that grabs a steam users recently played games in the last two weeks
export const getRecentlyPlayed = async (emailAddress) => {
    emailAddress = validation.emailValidation(emailAddress);
    const dbInfo = await handleErrorChecking(emailAddress);
    const user = dbInfo.user;
    const steamId = user.steamId;
    try {
        const client = createClient();
        await client.connect();
        const cacheExists = await client.exists("Recently Played: " + steamId);
        if (cacheExists) {
            const userGameData = await client.get(
                "Recently Played: " + steamId
            );
            const jsonRes = JSON.parse(userGameData);
            return jsonRes;
        }
        const response = await axios.get(
            `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${steamId}&format=json`
        );
        if (response.status === 200) {
            const data = response.data;
            if (data.response.games.length === 0) {
                user.recentlyPlayed = [];
                await setDbInfo(emailAddress, user);
                return [];
            } else {
                const userRecentlyPlayedGameData = data.response.games;
                if (
                    JSON.stringify(userRecentlyPlayedGameData) ===
                    JSON.stringify(user.recentlyPlayed)
                ) {
                    const user = await getDbInfo(emailAddress);
                    await client.set(
                        "Recently Played: " + steamId,
                        JSON.stringify(user.recentlyPlayed)
                    );
                    await client.expire("Recently Played: " + steamId, 1800);
                    return user.recentlyPlayed;
                } else {
                    user.recentlyPlayed = userRecentlyPlayedGameData;
                    user.recentlyPlayedCount =
                        userRecentlyPlayedGameData.length;
                    await setDbInfo(emailAddress, user);
                    await client.set(
                        "Recently Played: " + steamId,
                        JSON.stringify(userRecentlyPlayedGameData)
                    );
                    await client.expire("Recently Played: " + steamId, 1800); //set half hour expire time in case a user plays new games
                    return userRecentlyPlayedGameData;
                }
            }
        }
    } catch (e) {
        throw new ResourcesError("Error fetching steam account games");
    }
};

//Function that gets a users top 5 most played games
export const getTopFiveGames = async (emailAddress) => {
    emailAddress = validation.emailValidation(emailAddress);
    const dbInfo = await handleErrorChecking(emailAddress);
    const user = dbInfo.user;
    const steamId = user.steamId;
    const client = createClient();
    await client.connect();
    const cacheExists = await client.exists("Most played: " + steamId);
    if (cacheExists) {
        const userGameData = await client.get("Most played: " + steamId);
        return JSON.parse(userGameData);
    }
    if (user.gamesOwned.length > 0) {
        const userGames = user.gamesOwned;
        userGames.sort((a, b) => b.playtime_forever - a.playtime_forever);
        if (userGames.length < 5) {
            if (
                JSON.stringify(user.top5MostPlayed) ===
                JSON.stringify(userGames)
            ) {
                const user = await getDbInfo(emailAddress);
                await client.set(
                    "Most played: " + steamId,
                    JSON.stringify(user.gamesOwned)
                );
                await client.expire("Most played: " + steamId, 3600); //set expire time to one hour in case rankings change
                return userGames.slice(0, user.gamesOwned.length);
            } else {
                user.top5MostPlayed = userGames;
                await setDbInfo(emailAddress, user);
                await client.set(
                    "Most played: " + steamId,
                    JSON.stringify(userGames)
                );
                await client.expire("Most played: " + steamId, 3600); //set expire time to one hour in case rankings change
                return userGames.slice(0, userGames.length);
            }
        }
        const top5 = userGames.slice(0, 5);
        if (JSON.stringify(user.top5MostPlayed) === JSON.stringify(top5)) {
            const user = await getDbInfo(emailAddress);
            await client.set(
                "Most played: " + steamId,
                JSON.stringify(user.top5MostPlayed)
            );
            await client.expire("Most played: " + steamId, 3600); //set expire time to one hour in case rankings change
            return user.top5MostPlayed;
        } else {
            user.top5MostPlayed = userGames.slice(0, 5);
            await setDbInfo(emailAddress, user);
            await client.set(
                "Most played: " + steamId,
                JSON.stringify(userGames.slice(0, 5))
            );
            await client.expire("Most played: " + steamId, 3600); //set expire time to one hour in case rankings change
            return userGames.slice(0, 5);
        }
    } else {
        return [];
    }
};

//Function that gets a game from a users library
export const getUserOwnedGame = async (emailAddress, gameToFind) => {
    emailAddress = validation.emailValidation(emailAddress);
    gameToFind = validation.stringCheck(gameToFind);
    const dbInfo = await handleErrorChecking(emailAddress);
    const user = dbInfo.user;
    const client = createClient();
    await client.connect();
    const cacheExists = await client.exists(user.steamId + ": " + gameToFind);
    if (cacheExists) {
        const gameFound = await client.get(user.steamId + ": " + gameToFind);
        return JSON.parse(gameFound);
    }
    

    const userGames = user.gamesOwned;
    let gameFound;

    //Validate that the user has the game in their steam library
    userGames.forEach((game) => {
        let targetGame = game.name.toLowerCase();
        if (targetGame === gameToFind.toLowerCase()) {
            gameFound = game;
        }
    });
    if (!gameFound) {
        throw new ResourcesError(`You do not own ${gameToFind}`);
    } else {
        await client.set(user.steamId + ": " + gameToFind, JSON.stringify(gameFound));
        return gameFound;
    }
};

export const getPlayerAchievmentsForGame = async (emailAddress, gameToFind) => {
    emailAddress = validation.emailValidation(emailAddress);
    const dbInfo = await handleErrorChecking(emailAddress);
    const user = dbInfo.user;
    const game = await getUserOwnedGame(emailAddress, gameToFind);
    const client = createClient();
    await client.connect();
    const cacheExists = await client.exists(
        "Player Achievement Data: " + emailAddress + " " + game.name
    );
    if (cacheExists) {
        const playerAchievementData = await client.get(
            "Player Achievement Data: " + emailAddress + " " + game.name
        );
        return JSON.parse(playerAchievementData);
    }
    const userSteamId = user.steamId;
    const gameId = game.appid;

    try {
        const response = await axios.get(
            `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${gameId}&key=${API_KEY}&steamid=${userSteamId}`
        );

        if (response.status === 200) {
            const achievementData = response.data.playerstats.achievements;
            if (!achievementData) {
                throw new ResourcesError("Achievements not found");
            } else {
                const gameSchema = await getGameShema(gameId);
                const results = [];
                gameSchema.forEach((achievement) => {
                    const achievementStatus = achievementData.find(
                        (entry) => entry.apiname === achievement.apiName
                    );
                    results.push({
                        name: achievement.displayName,
                        achieved: achievementStatus.achieved,
                    });
                });
                const totalAchieved = results.reduce(
                    (acc, obj) => (obj.achieved ? acc + 1 : acc),
                    0
                );
                const returnData = {
                    username: user.username,
                    game: game.name,
                    achieved: totalAchieved,
                    totalAchievements: results.length,
                    achievements: results,
                };
                await client.set(
                    "Player Achievement Data: " +
                        emailAddress +
                        " " +
                        game.name,
                    JSON.stringify(returnData)
                );
                await client.expire(
                    "Player Achievement Data: " +
                        emailAddress +
                        " " +
                        game.name,
                    300
                ); //Set with a 5 minute expire time if new achievements get unlocked
                return returnData;
            }
        }
    } catch (e) {
        throw new ResourcesError("No achievement data found");
    }
};

//Function to get all games both users own
export const matchTwoUsersOnLibrary = async (
    user1emailAddress,
    user2emailAddress
) => {
    const user1OwnedGames = await retrieveGamesOwnedFromDb(user1emailAddress);
    const user2OwnedGames = await retrieveGamesOwnedFromDb(user2emailAddress);

    const matchingGames = [];

    for (const game of user1OwnedGames) {
        let matchingGame = user2OwnedGames.find(
            (findGame) => findGame.name === game.name
        );
        if (matchingGame) {
            matchingGames.push(matchingGame.name);
        }
    }

    return matchingGames;
};

export const getTrendingGames = async () => {
    const usersCollection = await users();
    const allUsers = await usersCollection.find({}).toArray();
    let allGames = [];
    allUsers.forEach((user) => {
        allGames.push(user.recentlyPlayed);
    });
    let trendingGames = {};
    allGames.forEach((gameArray) => {
        gameArray.forEach((game) => {
            trendingGames[game.name] = (trendingGames[game.name] || 0) + 1;
        });
    });

    const sortedTrendingArray = Object.entries(trendingGames).sort(
        (a, b) => b[1] - a[1]
    );
    let sortedTrendingGames = {};
    sortedTrendingArray.forEach(function (item) {
        sortedTrendingGames[item[0]] = item[1];
    });

    return sortedTrendingGames;
};
//Finds the top users you share the most games with
export const findTopMatchesOnLibrary = async (emailAddress) => {
    emailAddress = validation.emailValidation(emailAddress);
    const dbInfo = await handleErrorChecking(emailAddress);
    const user = dbInfo.user;
    const usersCollection = dbInfo.usersCollection;
    const allUsers = await usersCollection.find({}).toArray();
    const userFriends = user.friendList;
    let matchedUsers = [];
    for (const otherUser of allUsers) {
        if(!otherUser.steamProfileLink || otherUser.steamProfileLink === ""){continue}
        if (user.emailAddress !== otherUser.emailAddress) {
            const result = userFriends.find(
                (item) => item.username === otherUser.username
            );
            if (!result) {
                const matchingGames = await matchTwoUsersOnLibrary(
                    user.emailAddress,
                    otherUser.emailAddress
                );
                matchedUsers.push({
                    username: otherUser.username,
                    gamesShared: matchingGames,
                    avatarLink: otherUser.avatarLink
                });
            }
        }
    }

    return matchedUsers.sort(
        (a, b) => b.gamesShared.length - a.gamesShared.length
    );
};

//Matches users based on achievements, this one is really messy and comments explain how it works, but this can use some cleanup
export const matchOnAchievements = async (emailAddress, game, matchType) => {
    emailAddress = validation.emailValidation(emailAddress);
    const dbInfo = await handleErrorChecking(emailAddress);
    game = validation.stringCheck(game);
    validation.matchType(matchType);
    const user = dbInfo.user;
    const allUsersWithGame = await getAllUsersWhoOwnGame(game);
    const userFriends = user.friendList;
    //Get all user achievements. This includes names and whether or not it has been achieved
    const userAchievements = await getPlayerAchievmentsForGame(
        emailAddress,
        game
    );
    const userAchievementStates = await getAchievedStates(userAchievements);
    const matchedUsers = [];
    for (const otherUser of allUsersWithGame) {
        if(!otherUser.steamProfileLink || otherUser.steamProfileLink === ""){continue}
        if (user.emailAddress !== otherUser.emailAddress) {
            const result = userFriends.find(
                (item) => item.username === otherUser.username
            );
            if (!result) {
                //Get all user achievements. This includes names and whether or not it has been achieved
                const otherUserAchievements = await getPlayerAchievmentsForGame(
                    otherUser.emailAddress,
                    game
                );
                const otherUserAchievementStates = await getAchievedStates(
                    otherUserAchievements
                );

                //Find all achievements neither user has, and achievements that one user has and the other doesnt
                const achievementData = await mapAchievementStates(
                    userAchievementStates,
                    otherUserAchievementStates
                );

                //On frontend we will have a 3 ways to sort

                //Say I want to grind achievements with another person
                //sorts matched users based on highest count that neither player achieved
                if (matchType === "neitherAchieved") {
                    matchedUsers.push({
                        username: otherUser.username,
                        achievements: achievementData.neitherUserAchieved,
                        avatarLink: otherUser.avatarLink
                    });
                    matchedUsers.sort((userA, userB) => {
                        userB.achievements.length - userA.achievements.length;
                    });
                    return matchedUsers;
                }

                //Say I want to help someone else get achievements I already have and know how to get
                //Sorts matched users based on highest count of achievements I have, but the other user doesnt
                else if (matchType === "iAchieved") {
                    matchedUsers.push({
                        username: otherUser.username,
                        achievements: achievementData.userAchieved,
                        avatarLink: otherUser.avatarLink
                    });
                    matchedUsers.sort((userA, userB) => {
                        userB.achievements.length - userA.achievements.length;
                    });
                    return matchedUsers;
                }

                //Say I need help to get achievements i do not have
                //Sorts matched users based on highest count of achievements the other user has, but I dont
                if (matchType === "theyAchieved") {
                    matchedUsers.push({
                        username: otherUser.username,
                        achievements: achievementData.otherUserAchieved,
                        avatarLink: otherUser.avatarLink
                    });
                    matchedUsers.sort((userA, userB) => {
                        userB.achievements.length - userA.achievements.length;
                    });
                    return matchedUsers;
                }
            }
        }
    }
};

export const matchUsersOnPlaytimeByGame = async (emailAddress, game) => {
    emailAddress = validation.emailValidation(emailAddress);
    const dbInfo = await handleErrorChecking(emailAddress);
    const usersWithGame = await getAllUsersWhoOwnGame(game);
    const user = dbInfo.user;
    const userGameStats = await getUserOwnedGame(user.emailAddress, game);
    const userFriends = user.friendList;
    const matchedUsers = [];
    for (const otherUser of usersWithGame) {
        if(!otherUser.steamProfileLink || otherUser.steamProfileLink === ""){continue}
        if (otherUser.emailAddress !== user.emailAddress) {
            const result = userFriends.find(
                (item) => item.username === otherUser.username
            );
            if (!result) {
                const otherUserGameStats = await getUserOwnedGame(
                    otherUser.emailAddress,
                    game
                );
                const hourComparison =
                    Math.abs(
                        userGameStats.playtime_forever -
                            otherUserGameStats.playtime_forever
                    ) / 60;
                if (hourComparison < 25) {
                    matchedUsers.push({
                        username: otherUser.username,
                        playtime: Math.floor(
                            otherUserGameStats.playtime_forever / 60
                        ),
                        avatarLink: otherUser.avatarLink
                    });
                }
            }
        }
    }

    return matchedUsers.sort((a, b) => a.playtime_forever - b.playtime_forever);
};

//Helper function that returns achievements that neither user has, and achievements that one user has and the other doesnt.
export const mapAchievementStates = async (userStates, otherUserStates) => {
    if (!userStates || !otherUserStates) {
        throw new ResourcesError("You must provide both user's achievements");
    }
    const neitherAchieved = [];
    const userAchieved = [];
    const otherUserAchieved = [];

    userStates.notAchieved.forEach((item) => {
        if (
            !otherUserStates.achieved.some(
                (achievement) => achievement.name === item.name
            )
        ) {
            neitherAchieved.push(item.name);
        }
    });
    userStates.achieved.forEach((item) => {
        if (
            !otherUserStates.achieved.some(
                (achievement) => achievement.name === item.name
            )
        ) {
            userAchieved.push(item.name);
        }
    });

    otherUserStates.achieved.forEach((item) => {
        if (!userStates.achieved.some((obj) => obj.name === item.name)) {
            otherUserAchieved.push(item.name);
        }
    });

    //lets explain these variables in this object
    return {
        neitherUserAchieved: neitherAchieved, //Achievements neither user has
        userAchieved: userAchieved, //Achievements I have, but the other user doesnt
        otherUserAchieved: otherUserAchieved, //Achievements other user has, but I dont
    };
};

//Helper to sort achievements based on whether or not they have been achieved
export const getAchievedStates = async (achievementList) => {
    if (!achievementList) {
        throw new ResourcesError(
            "No achievements supplied in getAchievedStates"
        );
    }
    let achieved = [];
    let notAchieved = [];
    const achievementArray = achievementList.achievements;

    achieved = achievementArray.filter((obj) => obj.achieved === 1);
    notAchieved = achievementArray.filter((obj) => obj.achieved === 0);
    return { achieved: achieved, notAchieved: notAchieved };
};

//helper function to get all users in db that own a particular game
export const getAllUsersWhoOwnGame = async (gameName) => {
    const usersCollection = await users();
    const allUsers = await usersCollection.find({}).toArray();
    let usersWithGame = [];
    allUsers.forEach((user) => {
        const userGames = user.gamesOwned;
        const gameFound = userGames.find((game) => game.name === gameName);
        if (gameFound) usersWithGame.push(user);
    });

    return usersWithGame;
};

//Helper function to get achievement display names
export const getGameShema = async (gameId) => {
    const client = createClient();
    await client.connect();
    const cacheExists = await client.exists(gameId.toString());
    if (cacheExists) {
        const gameSchema = await client.get(gameId.toString());
        return JSON.parse(gameSchema);
    }
    try {
        const response = await axios.get(
            `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${gameId}`
        );
        if (response.status === 200) {
            const data = response.data.game;

            if (!data) {
                throw new ResourcesError(
                    "Achievements not found: Make sure the game youre supplying has achievements and your profile's achievement visibility is public"
                );
            } else {
                let achievementData = [];

                data.availableGameStats.achievements.forEach((achievement) => {
                    achievementData.push({
                        displayName: achievement.displayName,
                        apiName: achievement.name,
                    });
                });
                await client.set(
                    gameId.toString(),
                    JSON.stringify(achievementData)
                );
                await client.expire(gameId.toString(), 3600); //set with one hour expire time in case the game recieves an update with new achievements
                return achievementData;
            }
        }
    } catch (e) {
        throw new ResourcesError("Cannot get game schema");
    }
};


export const deleteUserData = async (emailAddress) => {
    emailAddress = validation.emailValidation(emailAddress);

    try {
        const dbInfo = await handleErrorChecking(emailAddress);
        const usersCollection = dbInfo.usersCollection;
        const user = dbInfo.user;

        user.top5MostPlayed = [];
        user.gamesOwned = [];
        user.recentlyPlayed = [];
        user.gamesOwnedCount = 0;
        user.recentlyPlayedCount = 0;

        // Remove gamesOwned, top5MostPlayed, and recentlyPlayed data from the redis cache
        const client = createClient();
        await client.connect();
        await client.del("Most played: " + user.steamId);
        await client.del("Recently Played: " + user.steamId);
        await client.del("Games Owned: " + user.steamId);
        await client.quit();

        await usersCollection.updateOne(
            { emailAddress: emailAddress },
            { $set: user },
            { returnDocument: "after" }
        );

        return { success: true };
    } catch (e) {
        return { error: e.message, success: false };
    }
};