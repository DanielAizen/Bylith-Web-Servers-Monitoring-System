import { Injectable } from '@nestjs/common';
import { portSet } from 'src/main';
import fetch from 'node-fetch';
import { InjectRepository } from '@nestjs/typeorm';
import { WSHealthStatusEntity } from '../modules/wsHealthStatus.entity';
import { Repository } from 'typeorm';
import { WebServiceMonitor } from 'src/monitor/modules/wsMonitor.interface';
import { WebServerHealthStatus } from '../modules/wsHealthStatus.interface';

@Injectable()
export class HealthStatusService {
  private healthStatusMap = new Map<string, number>()
    .set('success', 0)
    .set('failure', 0);
  private portStatusMap = new Map<number, Map<string, number>>();

  constructor(
    @InjectRepository(WSHealthStatusEntity)
    private readonly healthStatusServiceRepository: Repository<WSHealthStatusEntity>,
  ) {}

  start(): void {
    setInterval(async () => {
      this.measureLatency();
    }, 60000);
  }

  async measureLatency() {
    const url = 'http://localhost:';

    for (const port of portSet) {
      const fetchUrl = `${url}${port}`;
      const start = process.hrtime();
      const response = await fetch(fetchUrl);
      const end = process.hrtime(start);
      const latency =
        Math.round((end[0] * 1000 + end[1] / 1000000) * 100) / 100;
      const status = response.status;
      const wsHealthStatus = await this.checkHealthStatus(
        status,
        latency,
        port,
      );

      await this.healthStatusServiceRepository
        .createQueryBuilder()
        .insert()
        .into(WSHealthStatusEntity)
        .values([wsHealthStatus])
        .orUpdate({ conflict_target: [`port_id`], overwrite: ['status'] })
        .execute();
      const serverInfo: WebServiceMonitor = {
        watermark: new Date(),
        status: status,
        name: 'health check',
        http_url: fetchUrl,
        port: port,
      };
      await fetch(`${url}3000/monitor/insert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverInfo),
      });
    }
  }

  async checkHealthStatus(status: number, latency: number, port: number) {
    setTimeout(() => {}, 150);
    if (status === 200 && latency < 60) {
      this.healthStatusMap.set(
        'success',
        this.healthStatusMap.get('success') + 1,
      );
      this.healthStatusMap.set('failure', 0);
    } else if (status !== 200 || latency > 60) {
      this.healthStatusMap.set(
        'failure',
        this.healthStatusMap.get('failure') + 1,
      );
      this.healthStatusMap.set('success', 0);
    }
    this.portStatusMap.set(port, this.healthStatusMap);

    let consecutive = 0;
    if (this.portStatusMap.get(port).get('success') >= 5) consecutive = 1;
    if (this.portStatusMap.get(port).get('failure') >= 3) consecutive = 2;

    return {
      port_id: port,
      status: consecutive,
    };
  }
}
