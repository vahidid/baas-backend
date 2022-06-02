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
import { CreateNetworkDto } from './network.dto';
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
}
