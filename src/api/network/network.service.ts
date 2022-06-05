import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { execShellCommand } from 'src/common/helper/command.helper';
import { Repository } from 'typeorm';
import { NodeService } from '../node/node.service';
import { User } from '../user/user.entity';
import { CreateNetworkDto, GenerateGenesisBlockDto } from './network.dto';
import { Network } from './network.entity';
import { ICreateNetworkReponse, IGetNetworkReponse } from './network.types';
import * as fs from 'fs';
@Injectable()
export class NetworkService {
  @InjectRepository(Network)
  private readonly repository: Repository<Network>;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(NodeService)
  private readonly nodeService: NodeService;

  public async getNetwork(id: number): Promise<IGetNetworkReponse> {
    const network: Network = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['user', 'nodes'],
    });
    let genesisJSON;
    try {
      const rawGenesis = fs.readFileSync('/bc/genesis.json');
      genesisJSON = JSON.parse(rawGenesis.toString());
    } catch (error) {
      genesisJSON = {};
    }

    return {
      network,
      genesis: genesisJSON,
    };
  }

  public async getUserNetworks(userId: number): Promise<Network[]> {
    return await this.repository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  public async createNetwork(
    body: CreateNetworkDto,
  ): Promise<ICreateNetworkReponse> {
    const user = await this.userRepository.findOne({
      where: {
        id: body.user_id,
      },
    });

    const network: Network = new Network();

    network.name = body.name;
    network.user = user;

    const savedNetwork = await this.repository.save(network);

    const res: ICreateNetworkReponse = {
      network: savedNetwork,
      nodes: [],
    };

    await Promise.all(
      body.nodes.map(async (node) => {
        const newNode = await this.nodeService.createNode({
          ...node,
          network_id: savedNetwork.id,
        });

        res.nodes.push(newNode);
      }),
    );

    return res;
  }

  public async generateGenesisBlock(
    body: GenerateGenesisBlockDto,
    networkId: number,
  ): Promise<Network> {
    const network = await this.getNetwork(networkId);

    // TODO: remove ibft-validators-prefix-path in production
    let command = `cd /bc && polygon-edge genesis --consensus ibft --ibft-validators-prefix-path test-node- ${
      body.premine ? '--premine ' + body.premine : ''
    }`;

    await Promise.all(
      body.bootnodes.map(async (bootnode) => {
        const node = await this.nodeService.getNodeByNodeId(bootnode);
        command += ` --bootnode /ip4/127.0.0.1/tcp/${node.libp2p_port}/p2p/${node.node_id}`;
        return node;
      }),
    );

    // Cd to blockchain directory
    // await execShellCommand('cd /bc');

    const genesisBlock = await execShellCommand(command);

    console.log(genesisBlock);
    return network.network;
  }
}
