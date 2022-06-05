import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import * as Docker from 'dockerode';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('logs')
  logs(@MessageBody() data: any) {
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });
    const container = docker.getContainer('fb7e3aadc612');

    const logs = container.logs({
      follow: true,
      stdout: true,
    });

    // logs.then((stream) => {
    //   stream.on('data', (data) => {
    //     console.log(data.toString());
    //     return this.server.send('logs', data.toString());
    //   });
    // });

    // return

    // console.log('LOGS');
    return from([1]).pipe(
      map((item) => ({ event: 'events', data: container })),
    );
  }
}
