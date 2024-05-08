/* actions to communicate to backend to get user info */
"use server";

import { getUserByUsername } from "../../../backend/helpers";
import { getSteamUser } from "../../../backend/data/steam";
import im from "imagemagick"
import axios from 'axios'

export async function getUser(username) {
    try {
        const result = await getUserByUsername(username);
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}

export async function getSteamInfo(id) {
    try {
        const result = await getSteamUser(id);
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ error: e.message, success: false });
    }
}

export async function imageModify(imgUrl) {
    return new Promise(async (resolve, reject) => {
    console.log(imgUrl)
    try {
        const response = await axios.get(imgUrl, { responseType: 'arraybuffer'})
       
        const bufferedChunks = response.data
            
            const newImage = await new Promise((resolve, reject) => {
                im.resize({
                srcData: bufferedChunks,
                width: 400, 
                height: 400,
                gravity: 'North'
            }, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Buffer.from(stdout, 'binary'))
                }
            })});
            
            const base64Image = newImage.toString('base64')
            resolve(`data:image/jpg;base64,${base64Image}`);
        
    } catch (error) {
        reject(error);
    }});
}