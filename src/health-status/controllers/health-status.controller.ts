import { Controller, Get, Res} from '@nestjs/common';
import { HealthStatusService } from '../services/health-status.service';

@Controller('health-status')
export class HealthStatusController {
    constructor(private healthStatusService: HealthStatusService) {
    }

    @Get()
    calculateTime()  {
      return this.healthStatusService.measureLatency()
    }
}
