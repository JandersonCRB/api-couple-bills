import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Min } from 'class-validator';
import { Payer } from '../entities/bill.entity';

export class CreateBillDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ description: 'Price of the bill in cents' })
  priceInCents: number;

  @IsNotEmpty()
  @IsEnum(Payer)
  @ApiProperty({ enum: Payer, description: 'Who paid the bill' })
  payer: Payer;

  @IsNotEmpty()
  @ApiProperty()
  date: Date;
}
