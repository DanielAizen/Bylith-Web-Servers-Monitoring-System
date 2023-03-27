import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { WebServiceMonitor } from '../modules/wsMonitor.interface';
import { MonitorService } from '../services/monitor.service';
import { Request } from 'express';

@Controller('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService) {}

  //add
  @Post('create')
  createServer(@Body() server: WebServiceMonitor, @Req() req: Request) {
    return this.monitorService.createNewServer(server, req);
  }

  //edit
  @Put('edit/:port')
  editServerInformation(
    @Param('port') portToChange: number,
    @Body() server: WebServiceMonitor,
    @Req() req: Request,
  ) {
    return this.monitorService.updateServer(portToChange, server, req);
  }
  //delete

  //list
  @Get('listAll')
  getAllServers() {
    return this.monitorService.listAllServers();
  }
}


