import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ServerStatus } from "./wsHealthStatus.interface";

@Entity('ws_healthStatus')
export class WSHealthStatus {

    @PrimaryGeneratedColumn()
    port_id: number;

    @Column()
    status: ServerStatus;

    @Column()
    num_checks: number;
}