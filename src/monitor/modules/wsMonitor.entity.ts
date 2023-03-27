import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'ws_monitor', schema: 'web_server'})
export class WSMonitorEntity {
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