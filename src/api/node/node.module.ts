import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Network } from '../network/network.entity';
import { NodeController } from './node.controller';
import { Node } from './node.entity';
import { NodeService } from './node.service';

@Module({
  imports: [TypeOrmModule.forFeature([Node, Network])],
  controllers: [NodeController],
  providers: [NodeService],
  exports: [NodeService],
})
export class NodeModule {}
