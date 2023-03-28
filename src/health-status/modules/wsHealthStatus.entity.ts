import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ServerStatus } from "./wsHealthStatus.interface";

@Entity({name: 'ws_healthStatus', schema: 'web_server'})
export class WSHealthStatusEntity {

    @PrimaryGeneratedColumn()
    port_id: number;

    @Column()
    status: ServerStatus;

    @Column()
    num_checks: number;
}