import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ws_monitor')
export class WSMonitor {
    @PrimaryGeneratedColumn()
    date_created: Date;

    @Column()
    port: number

    @Column()
    name: string

    @Column()
    http_url: string

    @Column()
    status: number

    @Column()
    watermark: Date
}