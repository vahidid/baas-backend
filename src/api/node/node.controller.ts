import { Controller, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Node } from './node.entity';
import { NodeService } from './node.service';

@Controller('nodes')
export class NodeController {
  @Inject(NodeService)
  private readonly service: NodeService;

  @Post(':id/run')
  public async runNodeByNodeId(@Param('id') id: string): Promise<Node> {
    return await this.service.runNodeByNodeId(id);
  }
}
