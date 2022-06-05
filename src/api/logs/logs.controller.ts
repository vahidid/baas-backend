import { Controller, Sse } from '@nestjs/common';
import * as Docker from 'dockerode';
import { map, Observable } from 'rxjs';

@Controller('logs')
export class LogsController {
  @Sse('docker')
  public async getDockerLogs(): Promise<Observable<MessageEvent>> {
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });
    const container = docker.getContainer('5390515d64d0');
    console.log(container);

    return new Observable((observer) => {
      container.logs(
        {
          follow: true,
          stdout: true,
          stderr: true,
          tail: 500,
        },
        (err, stream) => {
          console.log('hi ');
          if (err) {
            console.log(err);
          }
          stream.on('data', (data) => {
            observer.next({
              data: data.toString(),
            });
          });
        },
      );

      // observer.next(eventResponse);
    }).pipe(map((event: MessageEvent) => event));
  }
}
