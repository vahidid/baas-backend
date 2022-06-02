import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateNetworkDto, GenerateGenesisBlockDto } from './network.dto';
import { Network } from './network.entity';
import { NetworkService } from './network.service';

@Controller('networks')
export class NetworkController {
  @Inject(NetworkService)
  private readonly service: NetworkService;

  @Get()
  public getUserNetworks(
    @Headers('user-id') userId: number,
  ): Promise<Network[]> {
    return this.service.getUserNetworks(userId);
  }

  @Get(':id')
  public getNetwork(@Param('id', ParseIntPipe) id: number): Promise<Network> {
    return this.service.getNetwork(id);
  }

  @Post()
  public createNetwork(@Body() body: CreateNetworkDto): Promise<Network> {
    return this.service.createNetwork(body);
  }

  @Post('genesis-block/:id')
  public generateGenesisBlock(
    @Body() body: GenerateGenesisBlockDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Network> {
    return this.service.generateGenesisBlock(body, id);
  }
}
