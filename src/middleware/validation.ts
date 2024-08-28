import {Request, Response, NextFunction } from 'express';
import isBase64 from 'is-base64';
import validator from 'validator';
import { BodyPatchConfirmRequest, BodyPostUploadRequest, MeasureType } from '../controllers/dto';

export function validateDataUpload(req: Request, res: Response, next: NextFunction){
    const data:BodyPostUploadRequest = req.body;
    if(!data
        || isBase64(data.image??"")
            || !validator.isDate(data.measure_datetime??"")
                || validator.isEmpty(data.customer_code??"")
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

export function validateDataList(req: Request, res: Response, next: NextFunction){
    const data = req.query.measure_type;
    if(data && !(data.toString().toUpperCase() in MeasureType)){
        res.status(400).json({
            error_code : "INVALID_TYPE",
            error_description: "Tipo de medição não permitida"
        })
        return
    }

    next();
}

export function validateDataConfirm(req: Request, res: Response, next: NextFunction){
    const data:BodyPatchConfirmRequest = req.body;
    if(!data
        || !validator.isUUID(data.measure_uuid??"")
            || validator.isEmpty(data.confirmed_value.toString()?? '')
    ){
        res.status(400).json({
            error_code : "INVALID_DATA",
            error_description: "Dados enviados inválidos"
        })

        return
    }

    next();
}





