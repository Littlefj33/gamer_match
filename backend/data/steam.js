import axios from 'axios'
import { users } from "../config/mongoCollections.js";
import { ResourcesError, handleErrorChecking, setDbInfo} from '../helpers.js';
import {createClient} from 'redis'
import validation from '../helpers.js';
const client = await createClient()
    .on("error", (err) => console.log("redis client error", err))
    .connect();
const apiKey = "C0FE0FB620850FD036A71B7373F47917"

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