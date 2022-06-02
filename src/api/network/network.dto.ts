import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNetworkDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public user_id: number;
}
