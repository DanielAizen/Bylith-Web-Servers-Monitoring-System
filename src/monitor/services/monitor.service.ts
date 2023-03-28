import { INestApplication, Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Repository } from 'typeorm';
import { WSMonitorEntity } from '../modules/wsMonitor.entity';
import { WebServiceMonitor } from '../modules/wsMonitor.interface';
import { Request } from 'express';
import { WSHealthStatusEntity } from 'src/health-status/modules/wsHealthStatus.entity';

@Injectable()
export class MonitorService {
  private portSet: Set<number>;
  private runningApps: Map<number, INestApplication>;
  constructor(
    @InjectRepository(WSMonitorEntity)
    private readonly monitorServiceReposetory: Repository<WSMonitorEntity>,
  ) {
    this.portSet = new Set<number>();
    this.runningApps = new Map<number, INestApplication>();
  }

  async createNewServer(serverInfo: WebServiceMonitor, req: Request) {
    //update if port already exists based on watermark add res
    const newApp = await NestFactory.create(AppModule);
    serverInfo.port = serverInfo.port
      ? serverInfo.port
      : this.generateRandomPort();
    this.portSet.add(serverInfo.port);
    this.runningApps.set(serverInfo.port, newApp);
    serverInfo.date_created = serverInfo.date_created
      ? serverInfo.date_created
      : new Date();
    serverInfo.watermark = new Date();
    serverInfo.http_url = req.url;

    await newApp.listen(serverInfo.port);
    return await this.monitorServiceReposetory.save(serverInfo);
  }

  async updateServer(
    portNum: number,
    serverInfo: WebServiceMonitor,
    req: Request,
  ) {
    let serverToUpdate = await this.monitorServiceReposetory.findOne({
      where: { port: portNum },
    });
    const serverToClose: INestApplication = this.runningApps.get(portNum);
    await serverToClose.close();

    serverToUpdate.date_created = new Date();
    serverToUpdate.http_url = req.url;
    serverToUpdate = { ...serverToUpdate, ...serverInfo };

    serverToClose.init();
    serverToClose.listen(portNum);

    return this.monitorServiceReposetory
      .createQueryBuilder()
      .update(WSMonitorEntity)
      .set(serverToUpdate)
      .where(`port=${portNum}`)
      .execute();
  }

  async deleteServer(portNum: number) {
    const serverToClose: INestApplication = this.runningApps.get(portNum);
    await serverToClose.close();
    return await this.monitorServiceReposetory
      .createQueryBuilder()
      .delete()
      .from(WSMonitorEntity)
      .where(`port=${portNum}`)
      .execute();
  }

  async getServer(portNum: number) {
    return await this.monitorServiceReposetory.findOne({
      where: { port: portNum },
      order: {
        date_created: 'DESC',
      },
    });
  }

  async getSpecificServer(portNum: number) {
    return await this.monitorServiceReposetory.find({
      where: { port: portNum },
      order: {
        date_created: 'DESC',
      },
      take: 10,
    });
  }

  async listAllServers() {
    return await this.monitorServiceReposetory.query(
      `select wsm.*, wshs.status 
      from web_server.ws_monitor as wsm 
      right join web_server.ws_health_status as wshs 
      on wsm.port = wshs.port_id;`
    );
  }

  generateRandomPort() {
    let newPort = Math.floor(Math.random() * 9000) + 1000;
    while (this.portSet.has(newPort)) {
      newPort++;
    }
    return newPort;
  }
}
