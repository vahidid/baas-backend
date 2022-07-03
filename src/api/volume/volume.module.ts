import { Module } from '@nestjs/common';
import { VolumeService } from './volume.service';
import { VolumeController } from './volume.controller';
import { DockerModule } from 'src/facade/docker/docker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volume } from './volume.entity';

@Module({
  imports: [DockerModule, TypeOrmModule.forFeature([Volume])],
  providers: [VolumeService],
  controllers: [VolumeController],
})
export class VolumeModule {}
