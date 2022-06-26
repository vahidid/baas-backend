import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DockerModule } from 'src/facade/docker/docker.module';
import { Network } from '../network/network.entity';
import { NodeController } from './node.controller';
import { Node } from './node.entity';
import { EventsGateway } from './node.gateway';
import { NodeService } from './node.service';

@Module({
  imports: [TypeOrmModule.forFeature([Node, Network]), DockerModule],
  controllers: [NodeController],
  providers: [NodeService, EventsGateway],
  exports: [NodeService],
})
export class NodeModule {}
