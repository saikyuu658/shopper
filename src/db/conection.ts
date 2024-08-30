import { DataSource } from "typeorm";
import { Measures } from "./entity/measure.entity";

export const Connection = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    password: '123shopper',
    username: 'postgres',
    entities: [
       Measures
    ],
    logging: true,
    synchronize: true,
})