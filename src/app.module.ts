import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorModule } from './monitor/monitor.module';
import { HealthStatusModule } from './health-status/health-status.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { makeGaugeProvider } from "@willsoto/nestjs-prometheus";
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
    }),
    MonitorModule,
    HealthStatusModule,
    // PrometheusModule.register({
    //   defaultMetrics: {
    //     enabled: true
    //   }
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    // makeGaugeProvider({
    //   name: 'latency',
    //   help: 'calculates the server latency',
    //   collect() {

    //   }
    // })
  ],
})
export class AppModule {}
