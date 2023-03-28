import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
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
  @Delete('delete/:port')
  deleteAndShutDownServer(@Param('port') portToDelete: number){
    return this.monitorService.deleteServer(portToDelete)
  }

  //list
  @Get('listOne/:port')
  getOneServer(@Param('port') portNum: number) {
    return this.monitorService.getServer(portNum)
  }

  @Get('listAll/:port')
  getServerRequests(@Param('port') portNum: number) {
    return this.monitorService.getSpecificServer(portNum)
  }

  @Get()
  getAllServers() {
    return this.monitorService.listAllServers();
  }
}


