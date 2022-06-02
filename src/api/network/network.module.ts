import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeModule } from '../node/node.module';
import { User } from '../user/user.entity';
import { NetworkController } from './network.controller';
import { Network } from './network.entity';
import { NetworkService } from './network.service';

@Module({
  imports: [TypeOrmModule.forFeature([Network, User]), NodeModule],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
