import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

export enum MeasureType {
    GAS = "GAS",
    WATER = "WATER"
}

@Entity()
export class Measures {
    @PrimaryGeneratedColumn('uuid')
    measures_uuid: string

    @CreateDateColumn()
    measure_datetime: Date

    @Column({
        type: "enum",
        enum: MeasureType,
        default: MeasureType.WATER
    })
    measure_type: MeasureType

    @Column()
    has_confirmed: boolean

    @Column()
    image_url:string

    @Column()
    customer_code: string;
}


