import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ws_health_status', schema: 'web_server' })
export class WSHealthStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  port_id: number;

  @Column()
  status: number;
}
