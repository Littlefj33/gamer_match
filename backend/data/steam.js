import axios from 'axios'
import { ResourcesError } from '../helpers.js';
import {createClient} from 'redis'
/*const client = await createClient()
    .on("error", (err) => console.log("redis client error", err))
    .connect();*/

export const verifySteamAccount = async (steamId) => {
    try {
        const response = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=C0FE0FB620850FD036A71B7373F47917&steamids=${steamId}`);
        
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
        throw new ResourcesError("Error: Steam account does not exist")
        
    }
}

