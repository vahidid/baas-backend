import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NodeService } from '../node/node.service';
import { User } from '../user/user.entity';
import { CreateNetworkDto } from './network.dto';
import { Network } from './network.entity';

@Injectable()
export class NetworkService {
  @InjectRepository(Network)
  private readonly repository: Repository<Network>;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(NodeService)
  private readonly nodeService: NodeService;

  public getNetwork(id: number): Promise<Network> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
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

  public async createNetwork(body: CreateNetworkDto): Promise<Network> {
    const user = await this.userRepository.findOne({
      where: {
        id: body.user_id,
      },
    });

    const network: Network = new Network();

    network.name = body.name;
    network.user = user;

    const savedNetwork = await this.repository.save(network);

    await Promise.all(
      body.nodes.map(async (node) => {
        const newNode = await this.nodeService.createNode({
          ...node,
          network_id: savedNetwork.id,
        });
        console.log(newNode);
      }),
    );

    return savedNetwork;
  }
}
