import { Module } from '@nestjs/common';
import { MonitorService } from './services/monitor.service';
import { MonitorController } from './controllers/monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WSMonitor } from './modules/wsMonitor.entity';
import { WSHealthStatus } from './modules/wsHealthStatus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WSMonitor, WSHealthStatus])
  ],
  providers: [MonitorService],
  controllers: [MonitorController]
})
export class MonitorModule {}
