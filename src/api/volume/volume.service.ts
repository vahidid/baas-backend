import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DockerService } from 'src/facade/docker/docker.service';
import { Repository } from 'typeorm';
import { Volume } from './volume.entity';
import * as fs from 'fs';
import TOMLParser from '@iarna/toml';
import * as verifyPDF from '@ninja-labs/verify-pdf';

@Injectable()
export class VolumeService {
  @Inject(DockerService)
  private readonly dockerService: DockerService;

  @InjectRepository(Volume)
  private readonly volumeRepository: Repository<Volume>;

  public async createVolume(title: string) {
    const signedPdfBuffer = fs.readFileSync('./sign_inside_wallet.pdf');

    const obj = verifyPDF(signedPdfBuffer);

    console.log(obj);
    const dockerVolume = await this.dockerService.createVolume(title);

    const volume = new Volume();
    volume.title = title;
    volume.path = dockerVolume.Mountpoint;

    await this.volumeRepository.save(volume);

    return volume;
  }
}
