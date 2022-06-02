import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { execShellCommand } from 'src/common/helper/command.helper';
import { Repository } from 'typeorm';
import { Network } from '../network/network.entity';
import { CreateNodeDto } from './node.dto';
import { Node } from './node.entity';

@Injectable()
export class NodeService {
  @InjectRepository(Node)
  private readonly repository: Repository<Node>;

  @InjectRepository(Network)
  private readonly networkRepository: Repository<Network>;

  public async createNode(node: CreateNodeDto): Promise<Node> {
    const network = await this.networkRepository.findOne({
      where: {
        id: node.network_id,
      },
    });

    const newNode: Node = new Node();

    // Make data directory
    await execShellCommand(`mkdir -p /bc/${node.node_name}`);

    // Create node keys
    const nodeId = await execShellCommand(
      `polygon-edge secrets init --data-dir /bc/${node.node_name}`,
    );

    const splitedRes = nodeId.split('=');
    newNode.node_id = splitedRes[splitedRes.length - 1]
      .trim()
      .replace(/\n/g, '');

    newNode.node_name = node.node_name;
    newNode.grpc_port = node.grpc_port;
    newNode.libp2p_port = node.libp2p_port;
    newNode.jsonrpc_port = node.jsonrpc_port;
    newNode.network = network;

    return this.repository.save(newNode);
  }

  public async getNodeByNodeId(nodeId: string): Promise<Node> {
    return await this.repository.findOne({
      where: {
        node_id: nodeId,
      },
    });
  }
}
