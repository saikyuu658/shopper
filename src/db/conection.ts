import { DataSource } from "typeorm";
import { Measures } from "./entity/measure.entity";

export const Connection = new DataSource({
    type: 'postgres',
    host: 'db',
    port: 5432,
    database: 'postgres',
    password: '123shopper',
    // password: '@cessoFLFnti',
    username: 'postgres',
    entities: [
       Measures
    ],
    logging: false,
    synchronize: true,
})