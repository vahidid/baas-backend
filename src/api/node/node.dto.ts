import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { HOME_DOMAIN } from './node.types';

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

export class CreateStellarNodeDto {
  @IsString()
  @IsNotEmpty()
  public node_name: string;

  @IsNumber()
  @IsNotEmpty()
  public peer_port: number;

  @IsNumber()
  @IsNotEmpty()
  public http_port: number;

  @IsNotEmpty()
  public passphrase: string;

  @IsNotEmpty()
  @IsArray()
  public home_domains: HOME_DOMAIN[];
}
