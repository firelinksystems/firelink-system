import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsGateway } from './events.gateway';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    JwtModule,
    JobsModule,
    TypeOrmModule.forFeature([]),
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class WebSocketModule {}
