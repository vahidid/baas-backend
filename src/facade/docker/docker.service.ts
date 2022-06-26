import { Injectable } from '@nestjs/common';
import { AuthInfo, docker } from './docker.constants';
import * as Docker from 'dockerode';
import { ICreateDockerContainerResponse } from './docker.types';

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

          function onFinished(err, output) {
            if (err) {
              reject(err);
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
  ): Promise<ICreateDockerContainerResponse> {
    return new Promise(async (resolve, reject) => {
      await this.pullImage(imageName);

      this.docker.createContainer(
        {
          Tty: false,
          Image: imageName,
          Cmd: args,
          name: containerName,
        },
        function (err, container) {
          console.error('ERROR: ', err);
          if (err) {
            reject(err);
          }

          container.start().then(() => {
            container.wait().then(() => {
              container.logs({ stdout: true }).then((logs) => {
                resolve({
                  container,
                  logs: logs.toString(),
                });
              });
              // container.logs(
              //   { follow: true, stdout: true },
              //   function (err, stream) {
              //     stream.on('data', (d) => {
              //       console.log(d);
              //       console.log('Stream ended');
              //     });
              //     stream.pipe(process.stdout);
              //   },
              // );
            });
          });
        },
      );
    });
  }

  public async runContainer(imageName: string, args: string[]) {
    return await this.docker.run(imageName, args, process.stdout);
  }
}
