import { Module } from '@nestjs/common';
import { HealthStatusService } from './services/health-status.service';
import { HealthStatusController } from './controllers/health-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WSHealthStatusEntity } from './modules/wsHealthStatus.entity';


@Module({
  imports: [TypeOrmModule.forFeature([WSHealthStatusEntity])],
  providers: [HealthStatusService],
  controllers: [HealthStatusController],
})
export class HealthStatusModule {}
