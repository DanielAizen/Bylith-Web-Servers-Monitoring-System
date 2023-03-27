import { INestApplication, Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { Repository } from 'typeorm';
import { WSMonitorEntity } from '../modules/wsMonitor.entity';
import { WebServiceMonitor } from '../modules/wsMonitor.interface';
import { Request } from 'express';

@Injectable()
export class MonitorService {
  private portSet: Set<number>;
  constructor(
    @InjectRepository(WSMonitorEntity)
    private readonly monitorServiceReposetory: Repository<WSMonitorEntity>,
  ) {
    this.portSet = new Set<number>();
  }

  async createNewServer(serverInfo: WebServiceMonitor, req: Request) {
    //update if port already exists based on watermark add res
    const newApp = await NestFactory.create(AppModule);
    serverInfo.port = serverInfo.port
      ? serverInfo.port
      : this.generateRandomPort();
    this.portSet.add(serverInfo.port);
    serverInfo.date_created = serverInfo.date_created
      ? serverInfo.date_created
      : new Date();
    serverInfo.watermark = new Date();
    serverInfo.http_url = req.url;

    await newApp.listen(serverInfo.port);
    return await this.monitorServiceReposetory.save(serverInfo);
  }

  async listAllServers() {
    return await this.monitorServiceReposetory
      .createQueryBuilder()
      .select('ws_monitor.port')
      .from(WSMonitorEntity, 'ws_monitor')
      .distinctOn(['ws_monitor.port'])
      .getMany();
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
      .where(`port=${portNum}`)
      .execute();
  }

  generateRandomPort() {
    let newPort = Math.floor(Math.random() * 9000) + 1000;
    while (this.portSet.has(newPort)) {
      newPort++;
    }
    return newPort;
  }
}


/**
 * select * from web_server.ws_monitor;
insert into web_server.ws_monitor(port, name, http_url) values (3000, 'test', '127.0.0.1');

delete from web_server.ws_monitor where port !=3000;

select distinct port from web_server.ws_monitor;

 */