import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { VolumeService } from './volume.service';
import { ICreateVolumeArgs } from './volume.types';

@Controller('volumes')
export class VolumeController {
  @Inject(VolumeService)
  private readonly volumeService: VolumeService;

  @Post('/')
  public async createVolume(@Body() body: ICreateVolumeArgs) {
    return this.volumeService.createVolume(body.title);
  }
}
