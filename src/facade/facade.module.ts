import { Module } from '@nestjs/common';
import { DockerModule } from './docker/docker.module';
import { StellarModule } from './stellar/stellar.module';

@Module({
  imports: [DockerModule, StellarModule]
})
export class FacadeModule {}
