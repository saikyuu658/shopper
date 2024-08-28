export class BodyPostUploadRequest{
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: MeasureType
}

export class BodyPatchConfirmRequest{
    measure_uuid: string;
    confirmed_value: number;
}

export enum MeasureType {
    GAS = "GAS",
    WATER = "WATER"
}


