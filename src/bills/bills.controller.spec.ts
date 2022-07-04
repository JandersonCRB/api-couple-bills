import { Test, TestingModule } from '@nestjs/testing';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Bill, Payer } from './entities/bill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('BillsController', () => {
  let controller: BillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillsController],
      providers: [BillsService],
      imports: [TypeOrmModule.forFeature([Bill])],
    }).compile();

    controller = module.get<BillsController>(BillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a bill', async () => {
    const bill = await controller.create({
      payer: Payer.FIRST,
      priceInCents: 100,
      title: 'Almoço',
      date: new Date(),
    });
    expect(bill).toBeDefined();
  });
});
