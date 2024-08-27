import { DataSource } from "typeorm";

export const Connection = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    password: '@cessoFLFnti',
    entities: ["./entity/**/*.ts"],
    logging: true,
    synchronize: false,
})