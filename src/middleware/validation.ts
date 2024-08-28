import {Request, Response, NextFunction } from 'express';
import isBase64 from 'is-base64';
import validator from 'validator';
import { BodyPostUploadRequest } from '../controllers/dto';

export function validateData(req: Request, res: Response, next: NextFunction){
    const data:BodyPostUploadRequest = req.body;
    if(!data
        || isBase64(data.image)
            || !validator.isDate(data.measure_datetime)
                || validator.isEmpty(data.customer_code)
                    || (data.measure_type != "WATER" && data.measure_type != "GAS" )
    ){
        
        res.status(400).json({
            error_code : "INVALID_DATA",
            error_description: "Dados enviados inválidos"
        })

        return
    }

    next();
}






