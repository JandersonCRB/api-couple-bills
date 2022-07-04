import { Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill, Payer } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { CalculateBillsDto } from './dto/calculate-bills.dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  whoIsDebtorAndCredor(difference: number) {
    if (difference > 0) {
      return {
        debtor: Payer.SECOND,
        creditor: Payer.FIRST,
      };
    } else if (difference < 0) {
      return {
        debtor: Payer.FIRST,
        creditor: Payer.SECOND,
      };
    }
    return {
      debtor: null,
      creditor: null,
    };
  }

  async calculate(): Promise<CalculateBillsDto> {
    const firstPersonBills = await this.billRepository.find({
      where: { payer: Payer.FIRST },
    });
    const secondPersonBills = await this.billRepository.find({
      where: { payer: Payer.SECOND },
    });

    const reduceBillPrice = (acc, bill: Bill) => acc + bill.priceInCents;

    const firstPersonTotal = firstPersonBills.reduce(reduceBillPrice, 0);
    const secondPersonTotal = secondPersonBills.reduce(reduceBillPrice, 0);
    const difference = firstPersonTotal - secondPersonTotal;

    return {
      total: Math.abs(difference),
      ...this.whoIsDebtorAndCredor(difference),
    };
  }

  create(createBillDto: CreateBillDto) {
    return this.billRepository.save(createBillDto);
  }

  findAll() {
    return this.billRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} bill`;
  }

  update(id: number, updateBillDto: UpdateBillDto) {
    return `This action updates a #${id} bill`;
  }

  remove(id: number) {
    return `This action removes a #${id} bill`;
  }
}
