/* actions to communicate to backend to get user info */
"use server";

import { getUserByUsername } from "../../../../backend/helpers";
import { getSteamUser } from "/backend/data/steam";
import im from "imagemagick"
import axios from 'axios'
import {createCanvas, loadImage} from 'canvas'

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
    try {
        const response = await axios.get(imgUrl, { responseType: 'arraybuffer'})
       
        const bufferedChunks = response.data

        const newImageBuffer = await new Promise((resolve, reject) => {
            im.resize({
                srcData: bufferedChunks,
                width: 400, 
                height: 400,
                gravity: 'Center'
            }, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(Buffer.from(stdout, 'binary'))
            }
            })
        });
        const squareImage = await loadImage(newImageBuffer);

        const canvas = createCanvas(squareImage.width, squareImage.height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#e2f2ff'; // Same color as our background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        

        const cornerRadius = 0.5 * Math.min(canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.moveTo(cornerRadius, 0);
        ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, cornerRadius);
        ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, cornerRadius);
        ctx.arcTo(0, canvas.height, 0, 0, cornerRadius);
        ctx.arcTo(0, 0, canvas.width, 0, cornerRadius);
        ctx.closePath();
        ctx.clip();

        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(squareImage, 0, 0, canvas.width, canvas.height);
        
        const circularImageBuffer = canvas.toBuffer('image/jpeg');
        const base64Image = circularImageBuffer.toString('base64');


        resolve(`data:image/jpg;base64,${base64Image}`);
        
    } catch (error) {
        reject(error);
    }});
}