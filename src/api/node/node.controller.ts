import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  MessageEvent,
  Param,
  ParseIntPipe,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import { Node } from './node.entity';
import { NodeService } from './node.service';
import * as fs from 'fs';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as es from 'event-stream';
import * as Docker from 'dockerode';
import { CreateStellarNodeDto } from './node.dto';

@Controller('nodes')
export class NodeController {
  @Inject(NodeService)
  private readonly service: NodeService;

  @Post(':id/run')
  public async runNodeByNodeId(@Param('id') id: string): Promise<Node> {
    return await this.service.runNodeByNodeId(id);
  }

  @Post(':id/kill')
  public async killNodeByNodeId(@Param('id') id: string): Promise<Node> {
    return await this.service.killNodeByNodeId(id);
  }

  @Get('byNetwork/:networkId')
  public async getNodesByNetworkId(
    @Param('networkId', ParseIntPipe) networkId: number,
  ): Promise<Node[]> {
    return await this.service.getNodesByNetworkId(networkId);
  }

  @Get(':nodeId')
  @Header('Content-Type', 'text/event-stream')
  public async getNodeByNodeId(@Param('nodeId') nodeId: string): Promise<Node> {
    return await this.service.getNodeByNodeId(nodeId);
  }

  @Sse(':nodeId/logs')
  public async getNodeLogs(
    @Param('nodeId') nodeId: string,
  ): Promise<Observable<MessageEvent>> {
    const node = await this.service.getNodeByNodeId(nodeId);

    return new Observable((observer) => {
      // fs.watch(`/bc/${node.node_name}/out.log`, (event, filename) => {
      //   if (event !== 'change') return;

      //   const newObj = getCurrent();
      //   const diff = new Diff();
      //   const diffs = diff.main(currObj, newObj);

      //   observer.next({
      //     data: diffs,
      //   });
      // });
      const s = fs
        .createReadStream(`/bc/${node.node_name}/out.log`)
        .pipe(es.split())
        .pipe(
          es.mapSync(function (line) {
            // pause the readstream
            s.pause();

            // process line here and call s.resume() when rdy
            // function below was for logging memory usage
            // logMemoryUsage(lineNr);
            observer.next({
              data: line,
            });

            // resume the readstream, possibly from a callback
            s.resume();
          }),
        );
      // observer.next(eventResponse);
    }).pipe(map((event: MessageEvent) => event));
  }

  @Sse('docker-logs')
  public async getDockerLogs(): Promise<Observable<MessageEvent>> {
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });
    const container = docker.getContainer('fb7e3aadc612');
    console.log(container);

    return new Observable((observer) => {
      container.logs(
        {
          follow: true,
          stdout: true,
          stderr: true,
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

  @Post('/stellar')
  public async createStellarNode(@Body() body: CreateStellarNodeDto) {
    return await this.service.createStellarNode(body);
  }
}
