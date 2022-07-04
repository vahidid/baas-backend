import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DockerService } from 'src/facade/docker/docker.service';
import { Repository } from 'typeorm';
import { Volume } from './volume.entity';

@Injectable()
export class VolumeService {
  @Inject(DockerService)
  private readonly dockerService: DockerService;

  @InjectRepository(Volume)
  private readonly volumeRepository: Repository<Volume>;

  public async createVolume(title: string) {
    // Create and inspect docker volume
    const volume = await this.dockerService.createVolume(title);

    // const volume = new Volume();
    // volume.title = title;
    // volume.path = dockerVolume.Mountpoint;

    // console.log(dockerVolume);
    const savedVolume = await this.volumeRepository.save({
      path: volume.Options.device,
      title: title,
    });

    return savedVolume;
  }
}
