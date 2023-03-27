import { Module } from '@nestjs/common';
import { HealthStatusService } from './services/health-status.service';
import { HealthStatusController } from './controllers/health-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WSHealthStatus } from './modules/wsHealthStatus.entity';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'src/logging.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([WSHealthStatus]),
    PrometheusModule.register(),
  ],
  providers: [
    HealthStatusService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [HealthStatusController],
})
export class HealthStatusModule {}
