import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import { execShellCommand } from 'src/common/helper/command.helper';
import { Repository } from 'typeorm';
import { Network } from '../network/network.entity';
import { CreateNodeDto } from './node.dto';
import { Node } from './node.entity';
import { ICreateNodeResponse, NodeStatus } from './node.types';
import * as fs from 'fs';
import { DockerService } from 'src/facade/docker/docker.service';

@Injectable()
export class NodeService {
  @InjectRepository(Node)
  private readonly repository: Repository<Node>;

  @InjectRepository(Network)
  private readonly networkRepository: Repository<Network>;

  @Inject(DockerService)
  private readonly dockerService: DockerService;

  public async createNode(node: CreateNodeDto): Promise<ICreateNodeResponse> {
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

    await this.repository.save(newNode);

    return {
      node: newNode,
      privateKey: splitedRes[1]
        .trim()
        .replace(/\n/g, '')
        .replace('Node ID', ''),
      nodeId: newNode.node_id,
    };
  }

  public async getNodeByNodeId(nodeId: string): Promise<Node> {
    return await this.repository.findOne({
      where: {
        node_id: nodeId,
      },
    });
  }

  public async runNodeByNodeId(nodeId: string): Promise<Node> {
    const node = await this.getNodeByNodeId(nodeId);

    const out = fs.openSync(`/bc/${node.node_name}/out.log`, 'a');
    const err = fs.openSync(`/bc/${node.node_name}/out.log`, 'a');

    const execRes = spawn(
      'polygon-edge',
      [
        'server',
        '--prometheus',
        `:900${node.grpc_port.toString().slice(0, 1)}`,
        '--data-dir',
        `/bc/${node.node_name}`,
        '--chain',
        '/bc/genesis.json',
        '--grpc-address',
        `:${node.grpc_port}`,
        '--libp2p',
        `:${node.libp2p_port}`,
        '--jsonrpc',
        `:${node.jsonrpc_port}`,
        '--seal',
      ],
      { detached: true, stdio: ['ignore', out, err] },
    );

    execRes.unref();

    node.pid = execRes.pid;
    node.status = NodeStatus.Running;
    this.repository.save(node);
    return node;
  }

  public async killNodeByNodeId(nodeId: string): Promise<Node> {
    const node = await this.getNodeByNodeId(nodeId);

    try {
      await execShellCommand(`kill ${node.pid}`);
    } catch (error) {}

    node.status = NodeStatus.Deactive;
    node.pid = null;
    this.repository.save(node);
    return node;
  }

  public async getNodesByNetworkId(networkId: number): Promise<Node[]> {
    return await this.repository.find({
      where: {
        network: {
          id: networkId,
        },
      },
    });
  }

  public async createNodeWithDocker(
    node: CreateNodeDto,
  ): Promise<ICreateNodeResponse> {
    const network = await this.networkRepository.findOne({
      where: {
        id: node.network_id,
      },
    });

    const newNode: Node = new Node();

    const container = await this.dockerService.createContainer(
      node.node_name,
      '0xpolygon/polygon-edge:latest',
      ['secrets', 'init', '--data-dir', `/bc/${node.node_name}`],
    );

    const splitedRes = container.logs.split('=');
    newNode.node_id = splitedRes[splitedRes.length - 1]
      .trim()
      .replace(/\n/g, '');

    console.log(splitedRes);
    // console.log(container.container.id);

    newNode.node_name = node.node_name;
    newNode.grpc_port = node.grpc_port;
    newNode.libp2p_port = node.libp2p_port;
    newNode.jsonrpc_port = node.jsonrpc_port;
    newNode.network = network;
    newNode.containerId = container.container.id;

    await this.repository.save(newNode);

    return {
      node: newNode,
      privateKey: splitedRes[1]
        .trim()
        .replace(/\n/g, '')
        .replace('Node ID', ''),
      nodeId: newNode.node_id,
    };
  }

  public async runNodeWithDocker(nodeId: string) {
    const node = await this.getNodeByNodeId(nodeId);

    // await this.dockerService.runContainer('0xpolygon/polygon-edge:latest');
  }
}
