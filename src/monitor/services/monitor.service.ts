import { INestApplication, Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Repository } from 'typeorm';
import { WSMonitorEntity } from '../modules/wsMonitor.entity';
import { WebServiceMonitor } from '../modules/wsMonitor.interface';
import { Request } from 'express';
import { portSet } from 'src/main';

@Injectable()
export class MonitorService {
  private runningApps: Map<number, INestApplication>;
  constructor(
    @InjectRepository(WSMonitorEntity)
    private readonly monitorServiceReposetory: Repository<WSMonitorEntity>,
  ) {
    this.runningApps = new Map<number, INestApplication>();
  }

  async createNewServer(serverInfo: WebServiceMonitor, req: Request) {
    //update if port already exists based on watermark add res
    serverInfo.port =
      serverInfo.port && !portSet.has(serverInfo.port)
        ? serverInfo.port
        : this.generateRandomPort();
    portSet.add(serverInfo.port);
    serverInfo.watermark = new Date();
    serverInfo.http_url = req.url;
    try {
      const newApp = await NestFactory.create(AppModule);
      this.runningApps.set(serverInfo.port, newApp);
      serverInfo.date_created = serverInfo.date_created
        ? serverInfo.date_created
        : new Date();
      await newApp.listen(serverInfo.port);
      serverInfo.status = 200;
    } catch (error) {
      serverInfo.date_created = serverInfo.date_created
        ? serverInfo.date_created
        : new Date();
      serverInfo.status = 500;
    }
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

    serverToUpdate.date_created = new Date();
    serverToUpdate.http_url = req.url;
    serverToUpdate = { ...serverToUpdate, ...serverInfo };

    return this.monitorServiceReposetory
      .createQueryBuilder()
      .update(WSMonitorEntity)
      .set(serverToUpdate)
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
      on wsm.port = wshs.port_id;`,
    );
  }

  async insertNewRecord(serverInfo: WebServiceMonitor) {
    await this.monitorServiceReposetory
      .createQueryBuilder()
      .insert()
      .into(WSMonitorEntity)
      .values(serverInfo)
      .execute();
  }

  generateRandomPort() {
    let newPort = Math.floor(Math.random() * 9000) + 1000;
    while (portSet.has(newPort)) {
      newPort++;
    }
    return newPort;
  }
}
