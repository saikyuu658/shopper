import { Request, Response } from 'express';
import { BodyPostUploadRequest } from './dto';
import { Connection as con  }  from "./../db/conection"
import { Measures } from '../db/entity/measure.entity';
import uploadImage from '../service/Gemini'


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
        const truncatedDate = new Date(year, month - 1, 1);
        
        const resultQuerySameDate =  await con.getRepository(Measures).createQueryBuilder('measures')
            .where("DATE_TRUNC('month', DATE(measures.datetime)) = :truncatedDate")
            .setParameter("truncatedDate", truncatedDate)
            .getOne()
        
        if(resultQuerySameDate){
            res.status(409).send({
                error_code: "DOUBLE_REPORT",
                error_description : "Leitura do mês já realizada"
            })
            return
        }

        const resp =  await uploadImage(data)

        console.log(resp)
        const sendToDb = new Measures()
        sendToDb.customer_code = data.customer_code;
        sendToDb.datetime = new Date(data.measure_datetime);
        sendToDb.type = data.measure_type;
        sendToDb.measure_value = parseFloat(resp);
        sendToDb.image_url = "C:/Users/david/Documents/shopper/src/service/storage/measure.png";
        sendToDb.has_confirmed = false;
        
        const result = await con.getRepository(Measures).save(sendToDb)
        
 
        res.status(200).send({
            image_url : result.image_url,
            measure_value : result.measure_value,
            measure_uuid: result.uuid 
        })
    }catch (error:any) {
        res.status(400).send({"erro" : error.message})
    }
}

export default {
    upload
}