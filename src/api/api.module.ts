import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NetworkModule } from './network/network.module';
import { NodeModule } from './node/node.module';

@Module({
  imports: [UserModule, NetworkModule, NodeModule],
})
export class ApiModule {}
