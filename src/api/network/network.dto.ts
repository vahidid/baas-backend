import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateNodeDto } from '../node/node.dto';

export class CreateNetworkDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public user_id: number;

  @Type(() => CreateNodeDto)
  @IsArray()
  @ValidateNested()
  public nodes!: CreateNodeDto[];
}
