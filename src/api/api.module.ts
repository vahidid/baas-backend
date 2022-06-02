import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NetworkModule } from './network/network.module';

@Module({
  imports: [UserModule, NetworkModule],
})
export class ApiModule {}
