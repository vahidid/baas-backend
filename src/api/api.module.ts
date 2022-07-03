import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NetworkModule } from './network/network.module';
import { NodeModule } from './node/node.module';
import { LogsModule } from './logs/logs.module';
import { VolumeModule } from './volume/volume.module';

@Module({
  imports: [UserModule, NetworkModule, NodeModule, LogsModule, VolumeModule],
})
export class ApiModule {}
