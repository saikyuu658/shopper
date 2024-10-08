import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"
import { MeasureType } from "../../controllers/dto"



@Entity()
export class Measures {
    @PrimaryGeneratedColumn('uuid')
    uuid: string

    @Column({
        type : "timestamp with time zone"
    })
    datetime: Date

    @Column({
        type: "enum",
        enum: MeasureType,
        default: MeasureType.WATER
    })
    type: MeasureType

    @Column()
    has_confirmed: boolean

    @Column({type: 'bigint', nullable: true})
    measure_value: number

    @Column()
    image_url:string

    @Column()
    customer_code: string;
}


