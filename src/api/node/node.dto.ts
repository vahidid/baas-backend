import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  @IsNotEmpty()
  public node_name: string;

  @IsNumber()
  @IsNotEmpty()
  public grpc_port: number;

  @IsNumber()
  @IsNotEmpty()
  public libp2p_port: number;

  @IsNumber()
  @IsNotEmpty()
  public jsonrpc_port: number;

  @IsEmpty()
  public network_id?: number;
}
