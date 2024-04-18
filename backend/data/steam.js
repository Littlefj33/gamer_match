import axios from 'axios'
import { ResourcesError, handleErrorChecking, setDbInfo, retrieveGamesOwnedFromDb} from '../helpers.js';
import {createClient} from 'redis'
import { users } from '../config/mongoCollections.js';
import validation from '../helpers.js';
const client = await createClient()
    .on("error", (err) => console.log("redis client error", err))
    .connect();
const apiKey = "C0FE0FB620850FD036A71B7373F47917"

//function to check if a steam user exists and returns their profile data
export const getSteamUser = async (steamId) => {
    steamId = validation.stringCheck(steamId);
    try {
        const response = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`);
        
        if (response.status === 200) {
            const data = response.data;
            if(data.response.players.length === 0){
                throw new ResourcesError("Error: Steam account not found (Make sure you are not using a custom steamURL and you use your ID number")
            }else{
                const playerData = data.response.players[0]
                return playerData
            }
        }
    } catch (e) {
        throw new ResourcesError("Steam account does not exist")
        
    }
}

//function that grabs ALL of the games in a Steam User's library
export const getSteamUsersGames = async (emailAddress) =>{
    const dbInfo = await handleErrorChecking(emailAddress)
    const user = dbInfo.user
    const steamId = user.steamId;
    try{
        const cacheExists = await client.exists("Games owned" + steamId)
        if(cacheExists){
            const userGameData = await client.get("Games owned" + steamId);
            return JSON.parse(userGameData)
        }
        const response = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_played_free_games=true&include_appinfo=true&format=json`)
        if (response.status === 200) {
            const data = response.data;
            if(data.response.games.length === 0){
                throw new ResourcesError("Steam account does not have any games!")
            }else{
                const userGameData = data.response.games
                user.gamesOwned = userGameData
                await setDbInfo(emailAddress, user)
                await client.set("Games owned" + steamId, JSON.stringify(userGameData))
                await client.expire("Games owned" + steamId, 1800) //set half hour expire time in case a user buys new games
                return userGameData
            }
        }
        
    }catch(e){
        throw new ResourcesError("Error fetching steam account games")
    }
}

//Function that grabs a steam users recently played games in the last two weeks
export const getRecentlyPlayed = async (emailAddress) =>{
    const dbInfo = await handleErrorChecking(emailAddress)
    const user = dbInfo.user
    const steamId = user.steamId;
    try{
        const cacheExists = await client.exists("Recently played" + steamId)
        if(cacheExists){
            const userGameData = await client.get("Recently played" + steamId);
            const jsonRes = JSON.parse(userGameData)
            return jsonRes
        }
        const response = await axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`)
        if (response.status === 200) {
            const data = response.data;
            if(data.response.games.length === 0){
                throw new ResourcesError("Steam account does not have any games!")
            }else{
                const userRecentlyPlayedGameData = data.response.games
                user.recentlyPlayed = userRecentlyPlayedGameData
                await setDbInfo(emailAddress, user)
                client.set("Recently played" + steamId, JSON.stringify(userGameData))
                return userGameData
            }
        }
        
    }catch(e){
        throw new ResourcesError("Error fetching steam account games")
    }
}

//Function that gets a users top 5 most played games
export const getTopFiveGames = async (emailAddress) =>{
    const dbInfo = await handleErrorChecking(emailAddress)
    const user = dbInfo.user
    const cacheExists = await client.exists("Most played: " + emailAddress)
        if(cacheExists){
            const userGameData = await client.get("Most played: " + emailAddress);
            return JSON.parse(userGameData)
        }
    if(user.gamesOwned.length > 0){
        const userGames = user.gamesOwned;
        userGames.sort((a, b) => b.playtime_forever - a.playtime_forever)
        if(userGames.length < 5){
            user.top5MostPlayed = userGames
            await setDbInfo(emailAddress, user)
            await client.set("Most played: " + emailAddress, JSON.stringify(userGames))
            await client.expire("Most played: " + emailAddress, 3600) //set expire time to one hour in case rankings change
            return userGames.slice(0, userGames.length)
        }
        user.top5MostPlayed = userGames.slice(0,5)
        await setDbInfo(emailAddress, user)
        await client.set("Most played: " + emailAddress, JSON.stringify(userGames.slice(0,5)))
        await client.expire("Most played: " + emailAddress, 3600) //set expire time to one hour in case rankings change
        return userGames.slice(0, 5);
    }else{
        return 
    }
}

//Function that gets a game from a users library
export const getUserOwnedGame = async (emailAddress, gameToFind) => {
    const cacheExists = await client.exists(emailAddress + ": " +gameToFind)
    if(cacheExists){
        const gameFound = await client.get(emailAddress + ": " +gameToFind)
        return JSON.parse(gameFound)
    }
    gameToFind = validation.stringCheck(gameToFind)
    const dbInfo = await handleErrorChecking(emailAddress)
    const user = dbInfo.user

    const userGames = user.gamesOwned
    let gameFound

    //Validate that the user has the game in their steam library
    userGames.forEach((game) =>{
        let targetGame = game.name.toLowerCase()
        if(targetGame === gameToFind.toLowerCase()){
            gameFound = game
        }
    })
    if(!gameFound){
        throw new ResourcesError(`You do not own ${gameToFind}`)
    } else{
        await client.set(gameToFind, JSON.stringify(emailAddress + ": " + gameFound))
        return gameFound
    }
    
}

//Function to get all of the players achievements in a game, and returns a list of all achievement names and whether or not they got the achievement
export const getPlayerAchievmentsForGame = async(emailAddress, gameToFind) =>{
    const dbInfo = await handleErrorChecking(emailAddress)
    const user = dbInfo.user
    const game = await getUserOwnedGame(emailAddress, gameToFind)
    const cacheExists = await client.exists("Player Achievement Data: " + emailAddress + " " + game.name)
    if(cacheExists){
        const playerAchievementData = await client.get("Player Achievement Data: " + emailAddress + " " + game.name)
        return JSON.parse(playerAchievementData)
    }
    const userSteamId = user.steamId;
    const gameId = game.appid
    
    try {
        const response = await axios.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${gameId}&key=${apiKey}&steamid=${userSteamId}`);
        
        if (response.status === 200) {
            const achievementData = response.data.playerstats.achievements;
            if(!achievementData){
                throw new ResourcesError("Achievements not found")
            }else{
                const gameSchema = await getGameShema(gameId)
                const results = []
                gameSchema.forEach((achievement) => {
                    const achievementStatus = achievementData.find(entry => entry.apiname === achievement.apiName)
                    results.push({
                        name: achievement.displayName,
                        achieved: achievementStatus.achieved
                    })
                })
                const totalAchieved = results.reduce((acc, obj) => obj.achieved ? acc + 1 : acc, 0);
                const returnData = {
                    username: user.username, 
                    game: game.name, 
                    achieved: totalAchieved,
                    totalAchievements: results.length,
                    achievements: results}
                await client.set("Player Achievement Data: " + emailAddress + " " + game.name, JSON.stringify(returnData))
                await client.expire("Player Achievement Data: " + emailAddress + " " + game.name, 300) //Set with a 5 minute expire time if new achievements get unlocked
                return returnData
            }
        }
    } catch (e) {
        throw new ResourcesError("No achievement data found")
        
    }
}

//Function to get all games both users own
export const matchTwoUsersOnLibrary = async (user1emailAddress, user2emailAddress) => {
    const user1OwnedGames = await retrieveGamesOwnedFromDb(user1emailAddress);
    const user2OwnedGames = await retrieveGamesOwnedFromDb(user2emailAddress);

    const matchingGames = [];

    for(const game of user1OwnedGames){
        let matchingGame = user2OwnedGames.find(findGame => findGame.name === game.name)
        if(matchingGame){
            matchingGames.push(matchingGame)
        }
    }

    return matchingGames
}

//Finds the top 3 users you share the most games with
export const findTop3MatchesOnLibrary = async (emailAddress)=>{
    const dbInfo = await handleErrorChecking(emailAddress)
    const user = dbInfo.user
    const usersCollection = dbInfo.usersCollection
    const allUsers = await usersCollection.find({}).toArray()

    const commonLibraries = []
    for(const otherUser of allUsers){
        if(user.emailAddress !== otherUser.emailAddress){
            const matchingGames = await matchTwoUsersOnLibrary(user.emailAddress, otherUser.emailAddress)
            commonLibraries.push({
                username: user.username, 
                userMatched: otherUser.username,
                userMatchedProfile: otherUser.steamProfileLink,
                gamesShared: matchingGames,
                numGamesShared: matchingGames.length })
        }   
    }

    return commonLibraries.sort((a, b) => b.numGamesShared - a.numGamesShared).slice(0,3)
}

//Matches users based on achievements, this one is really messy and comments explain how it works, but this can use some cleanup
export const matchOnAchievements = async (emailAddress, game, matchType) =>{
    const dbInfo = await handleErrorChecking(emailAddress)
    game = validation.stringCheck(game)
    validation.matchType(matchType)
    const user = dbInfo.user
    const allUsersWithGame = await getAllUsersWhoOwnGame(game);

    //Get all user achievements. This includes names and whether or not it has been achieved
    const userAchievements = await getPlayerAchievmentsForGame(emailAddress, game)
    const userAchievementStates = await getAchievedStates(userAchievements) 
    const matchedUsers = []
    for(const otherUser of allUsersWithGame){
        if(user.emailAddress !== otherUser.emailAddress){
            //Get all user achievements. This includes names and whether or not it has been achieved
            const otherUserAchievements = await getPlayerAchievmentsForGame(otherUser.emailAddress, game)
            const otherUserAchievementStates = await getAchievedStates(otherUserAchievements)

            //Find all achievements neither user has, and achievements that one user has and the other doesnt
            const achievementData = await mapAchievementStates(userAchievementStates, otherUserAchievementStates)
            matchedUsers.push({
                username: user.username,
                otherUser: otherUser.username,
                otherUserSteamProfile: otherUser.steamProfileLink,
                achievementsNeitherHas: achievementData.neitherUserAchieved,
                achievementsUserHasOtherDoesnt: achievementData.userAchieved,
                achievementsOtherHasUserDoesnt: achievementData.otherUserAchieved
            })
        }
    }

    //On frontend we will have a 3 ways to sort

    //Say I want to grind achievements with another person
    //sorts matched users based on highest count that neither player achieved
    if(matchType === 'neitherAchieved'){
        return matchedUsers.sort((userA, userB) =>{
            userB.achievementsNeitherHas.length - userA.achievementsNeitherHas.length
        })
    }

    //Say I want to help someone else get achievements I already have and know how to get
    //Sorts matched users based on highest count of achievements I have, but the other user doesnt
    else if(matchType === 'iAchieved'){
        return matchedUsers.sort((userA, userB) =>{
            userB.achievementsUserHasOtherDoesnt.length - userA.achievementsUserHasOtherDoesnt.length
        })
    }

    //Say I need help to get achievements i do not have
    //Sorts matched users based on highest count of achievements the other user has, but I dont
    if(matchType === 'theyAchieved'){
        return matchedUsers.sort((userA, userB) =>{
            userB.achievementsOtherHasUserDoesnt.length - userA.achievementsOtherHasUserDoesnt.length
        })
    }
}

//Helper function that returns achievements that neither user has, and achievements that one user has and the other doesnt.
export const mapAchievementStates = async (userStates, otherUserStates) => {
    if(!userStates || !otherUserStates){
        throw new ResourcesError("You must provide both user's achievements")
    }
    const neitherAchieved = [];
    const userAchieved = [];
    const otherUserAchieved = [];

    
    userStates.notAchieved.forEach(item => {
        if (!otherUserStates.achieved.some(achievement => achievement.name === item.name)) {
            neitherAchieved.push(item.name);
        }
    });
    userStates.achieved.forEach(item => {
        if (!otherUserStates.achieved.some(achievement => achievement.name === item.name)) {
            userAchieved.push(item.name);
        }
    });

    otherUserStates.achieved.forEach(item => {
        if (!userStates.achieved.some(obj => obj.name === item.name)) {
            otherUserAchieved.push(item.name);
        }
    });

    //lets explain these variables in this object
    return{
        neitherUserAchieved: neitherAchieved, //Achievements neither user has
        userAchieved: userAchieved,  //Achievements I have, but the other user doesnt
        otherUserAchieved: otherUserAchieved //Achievements other user has, but I dont
    }
}

export const getAchievedStates = async (achievementList)=>{
    if(!achievementList){throw new ResourcesError("No achievements supplied in getAchievedStates")}
    let achieved = []
    let notAchieved = []
    const achievementArray = achievementList.achievements

    achieved = achievementArray.filter(obj => obj.achieved === 1)
    notAchieved = achievementArray.filter(obj => obj.achieved === 0)
    return {achieved: achieved, notAchieved: notAchieved}
}

//helper function to get all users in db that own a particular game
export const getAllUsersWhoOwnGame = async (gameName) =>{
    const usersCollection = await users();
    const allUsers = await usersCollection.find({}).toArray()
    let usersWithGame = []
    allUsers.forEach((user)=>{
        const userGames = user.gamesOwned
        const gameFound = userGames.find(game => game.name === gameName)
        if(gameFound)usersWithGame.push(user)
    })

    return usersWithGame
}


//Helper function to get achievement display names
export const getGameShema = async (gameId) => {
    const cacheExists = await client.exists(gameId.toString())
    if(cacheExists){
        const gameSchema = await client.get(gameId.toString())
        return JSON.parse(gameSchema)
    }
    try{
        const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${gameId}`)
        if (response.status === 200) {
            const data = response.data.game;
            if(!data){
                throw new ResourcesError("Achievements not found")
            }else{
                
                let achievementData = []
                data.availableGameStats.achievements.forEach((achievement) => {
                    achievementData.push({displayName: achievement.displayName, apiName: achievement.name})
                })
                await client.set(gameId.toString(), JSON.stringify(achievementData))
                await client.expire(gameId.toString(), 3600) //set with one hour expire time in case the game recieves an update with new achievements
                return achievementData
            }
        }
    }catch(e){
        throw new ResourcesError("Cannot get game schema")
    }
}