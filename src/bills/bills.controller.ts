import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Bills')
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get('calculate')
  @ApiProperty({ description: 'Calculates how owes who by checking the bills' })
  calculate() {
    return this.billsService.calculate();
  }

  @Post()
  create(@Body() createBillDto: CreateBillDto) {
    return this.billsService.create(createBillDto);
  }

  @Get()
  findAll() {
    return this.billsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return this.billsService.update(+id, updateBillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billsService.remove(+id);
  }
}
