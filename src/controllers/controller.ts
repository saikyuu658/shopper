import { Request, Response } from 'express';
import { BodyPatchConfirmRequest, BodyPostUploadRequest } from './dto';
import { Connection as con  }  from "./../db/conection"
import { Measures } from '../db/entity/measure.entity';
import uploadImage from '../service/Gemini'
import fs from 'fs'
import jwt from 'jsonwebtoken'; 


con.initialize().then(() => {
    console.log("Data Source has been initialized!")
    }).catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })



async function upload ( req: Request, res: Response) {
    try {
        const data:BodyPostUploadRequest = req.body
        const month = new Date(data.measure_datetime).getMonth()
        const year = new Date(data.measure_datetime).getFullYear()
        const truncatedDate = new Date(year, month, 1);
        
        const resultQuerySameDate =  await con.getRepository(Measures).createQueryBuilder('measures')
            .where("DATE_TRUNC('month', DATE(measures.datetime)) = :truncatedDate AND type = :type", )
            .setParameter("truncatedDate", truncatedDate)
            .setParameter("type", data.measure_type)
            .getOne()
        
        if(resultQuerySameDate){
            res.status(409).send({
                error_code: "DOUBLE_REPORT",
                error_description : "Leitura do mês já realizada"
            })
            return
        }

        const resp =  await uploadImage(data)

        const sendToDb = new Measures()
        sendToDb.customer_code = data.customer_code;
        sendToDb.datetime = new Date(data.measure_datetime);
        sendToDb.type = data.measure_type;
        sendToDb.measure_value = parseFloat(resp.resp);
        sendToDb.image_url = "./storage/"+resp.fileName;
        sendToDb.has_confirmed = false;
        
        const result = await con.getRepository(Measures).save(sendToDb)
 
        res.status(200).send({
            image_url : 'http://localhost:3000/'+resp.token,
            measure_value : result.measure_value,
            measure_uuid: result.uuid 
        })
    }catch (error:any) {
        res.status(500).send({"erro" : error.message})
    }
}


async function confirm ( req: Request, res: Response) {
    try {

        const data:BodyPatchConfirmRequest = req.body

        const result = await con.getRepository(Measures).findOne({
            where : {
                uuid : data.measure_uuid
            }
        });
        if(!result){
            res.status(404).send({
                error_code:"MEASURE_NOT_FOUND",
                "error_description": "Nenhuma leitura identificada"})
            return
        }else if(result.has_confirmed){
            res.status(409).send({
                error_code:"CONFIRMATION_DUPLICATE",
                "error_description": "leitura já confirmada"})
            return
        }

        result.measure_value = data.confirmed_value;
        result.has_confirmed = true;
        await con.getRepository(Measures).save(result); 
        res.status(200).send({success: true})
    } catch (error:any) {
        res.status(500).send({'error': error.message})
    }
}

async function list(req: Request, res: Response){
    try {
        const customerCode = req.params.customerCode;
        const queryParam =  req.query.measure_type?.toString();
        let result = await con.getRepository(Measures).find({
            where : {
                customer_code : customerCode,
            }
        });
        if(!result){
            res.status(404).send({
                error_code:"MEASURE_NOT_FOUND",
                "error_description": "Nenhum cliente identificado"})
            return
        }
        if(queryParam){
            result = result.filter((e)=>e.type.toUpperCase() == queryParam.toUpperCase())
        }
        res.status(200).send({
            customer_code: customerCode,
            measures : result
        })
    } catch (error:any) {
        res.status(500).send({'error': error.message})
    }

}

async function getImage(req: Request, res: Response){
    
   try {
    const {image} = req.params;
    const t = jwt.verify(image, 'pixotes')
    if(!t || typeof(t) == 'string'){
        res.write('Tempo expirado!')
        return 
    }
    fs.readFile('./storage/'+ t.file, function (err, data) {
        if (err) throw err;
        res.write(data);
        return 
    });
   } catch (error:any) {
        res.status(500).send("Tempo expirado")
   }

}




export default {
    upload,
    confirm,
    getImage,
    list
}