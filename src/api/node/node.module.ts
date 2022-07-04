import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DockerModule } from 'src/facade/docker/docker.module';
import { StellarModule } from 'src/facade/stellar/stellar.module';
import { Network } from '../network/network.entity';
import { VolumeModule } from '../volume/volume.module';
import { NodeController } from './node.controller';
import { Node } from './node.entity';
import { EventsGateway } from './node.gateway';
import { NodeService } from './node.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Node, Network]),
    DockerModule,
    VolumeModule,
    StellarModule,
  ],
  controllers: [NodeController],
  providers: [NodeService, EventsGateway],
  exports: [NodeService],
})
export class NodeModule {}
