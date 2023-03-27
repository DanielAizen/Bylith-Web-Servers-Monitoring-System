import { Module } from '@nestjs/common';
import { MonitorService } from './services/monitor.service';
import { MonitorController } from './controllers/monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WSMonitorEntity } from './modules/wsMonitor.entity';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([WSMonitorEntity])],
  providers: [MonitorService],
  controllers: [MonitorController],
})
export class MonitorModule {}
