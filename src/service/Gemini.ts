import { GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'; 
import { BodyPostUploadRequest } from "../controllers/dto";
import fs from 'fs'
import jwt from 'jsonwebtoken'
dotenv.config();

const API_KEY  = process.env.GEMINI_API_KEY?? ''

async function uploadImage(val: BodyPostUploadRequest){
    const fileName = Date.now();
    try {
        const base64Data = val.image.replace(/^data:image\/png;base64,/, "")
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync("C:/Users/david/Documents/shopper/src/service/storage/"+fileName+".png", buffer);
    } catch (err) {
        console.error("Erro ao salvar a imagem:", err);
    }
   

    const fileManager = new GoogleAIFileManager(API_KEY);

    const uploadResponse = await fileManager.uploadFile( __dirname+"/storage/"+fileName+".png", {
        mimeType: "image/png",
        displayName: "Measure",
    });

    const resp = await readImage(uploadResponse)
    const token = jwt.sign( {file: fileName+".png"}, 'pixotes', {expiresIn : "1h"})
    return {resp: resp, fileName: fileName+".png", token: token}
}

async function readImage(uploadResult: UploadFileResponse) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
    "Identify the exact number displayed on the meter's digital display in this image. Ignore other visual elements and provide only the measurement",
    {
        fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
        },
    },
    ]);
    return result.response.text();

}

export default uploadImage