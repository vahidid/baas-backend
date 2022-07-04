import { Injectable } from '@nestjs/common';
import { AuthInfo, docker } from './docker.constants';
import * as Docker from 'dockerode';
import { ICreateDockerContainerResponse } from './docker.types';
import { Volume } from 'src/api/volume/volume.entity';
import * as path from 'path';

@Injectable()
export class DockerService {
  private readonly docker: Docker = docker;

  public getImage(imageName: string): Docker.Image {
    return this.docker.getImage(imageName);
  }

  public async pullImage(imageName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.docker.pull(
        imageName,
        { authconfig: AuthInfo },
        function (err, stream) {
          docker.modem.followProgress(stream, onFinished, onProgress);
          if (err) {
            reject(err);
          }

          function onFinished(error, output) {
            if (error) {
              reject(error);
            }
            resolve(output);
          }
          function onProgress(event) {
            console.log(event.status);
          }
        },
      );
    });
  }

  public async createContainer(
    containerName: string,
    imageName: string,
    args: string[],
    volumes: Volume[] = [],
  ): Promise<ICreateDockerContainerResponse> {
    return new Promise(async (resolve, reject) => {
      await this.pullImage(imageName);

      console.log(
        'CONTAINER VOLUMES: ',
        volumes.reduce((acc, volume) => {
          acc[volume.path] = {};
          return acc;
        }, {}),
      );

      this.docker.createContainer(
        {
          Tty: false,
          Image: imageName,
          Cmd: args,
          name: containerName,
          Volumes: volumes.reduce((acc, volume) => {
            acc[volume.path] = {};
            return acc;
          }, {}),
        },
        function (err, container) {
          console.error('ERROR: ', err);
          if (err) {
            reject(err);
          }

          // container.attach(
          //   { stream: true, stdout: true, stderr: true },
          //   function (err, stream) {
          //     if (err) {
          //       reject(err);
          //     }
          //     stream.pipe(process.stdout);
          //   },
          // );

          // container.start().then((error, result) => {
          //   container.wait().then(() => {
          //     // container.logs({ stdout: true }).then((logs) => {
          //     //   resolve({
          //     //     container,
          //     //     logs: logs.toString(),
          //     //   });
          //     // });
          //     // container.logs(
          //     //   { follow: true, stdout: true },
          //     //   function (err, stream) {
          //     //     stream.on('data', (d) => {
          //     //       console.log(d);
          //     //       console.log('Stream ended');
          //     //     });
          //     //     stream.pipe(process.stdout);
          //     //   },
          //     // );
          //   });
          // });

          container.start((err, data) => {
            if (err) {
              reject(err);
            }
            console.log(data);
            // resolve(container);
          });
        },
      );
    });
  }

  public async runContainer(imageName: string, args: string[]) {
    return await this.docker.run(imageName, args, process.stdout);
  }

  public async createVolume(title: string): Promise<Docker.VolumeInspectInfo> {
    // console.log(path.resolve(, 'var'));
    // return await this.docker.createVolume({
    //   Name: title,
    //   Labels: {
    //     'com.baas-service.volume.scope': 'local',
    //   },
    //   Driver: 'local',
    //   DriverOpts: {
    //     device: '/baas/volumes/_data/',
    //     o: 'bind',
    //     type: 'none',
    //   },
    // });

    return new Promise((resolve, reject) => {
      this.docker.createVolume(
        {
          Name: title,
          Labels: {
            'com.baas-service.volume.scope': 'local',
          },
          DriverOpts: {
            device: `/home/vahid/.baas/volumes/${title}`,
            type: 'none',
            o: 'bind',
          },
        },
        (err, volume) => {
          if (err) {
            reject(err);
          }

          volume.inspect((error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
        },
      );
    });
  }

  public async getVolumeInspect(title: string) {
    const volume = this.docker.getVolume(title);
    return await volume.inspect();
  }
}
