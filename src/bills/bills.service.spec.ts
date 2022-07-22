import { Test, TestingModule } from '@nestjs/testing';
import { BillsService } from './bills.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill, Payer } from './entities/bill.entity';
import { DataSource, Repository } from 'typeorm';
import {
  clearDatabase,
  configAndDatabase,
} from '../../test/helpers/test.helpers.spec';

describe('BillsService', () => {
  let billsService: BillsService;
  let billsRepository: Repository<any>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillsService],
      imports: [...configAndDatabase, TypeOrmModule.forFeature([Bill])],
    }).compile();

    billsService = module.get<BillsService>(BillsService);
    dataSource = module.get<DataSource>(DataSource);
    billsRepository = dataSource.getRepository(Bill);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  it('should be defined', () => {
    expect(billsService).toBeDefined();
  });

  it('should create a bill', async () => {
    const bill = await billsService.create({
      payer: Payer.FIRST,
      priceInCents: 100,
      title: 'Almoço',
      date: new Date(),
    });
    expect(bill).toBeDefined();
    expect(bill.payer).toBe(Payer.FIRST);
    expect(bill.priceInCents).toBe(100);
    expect(bill.title).toBe('Almoço');
    expect(bill.date).toBeInstanceOf(Date);
  });

  const createExampleBills = async () => {
    await billsRepository.save({
      title: 'Almoço',
      payer: Payer.FIRST,
      priceInCents: 100,
      date: new Date(),
    });
    await billsRepository.save({
      title: 'Lanche',
      payer: Payer.SECOND,
      priceInCents: 200,
      date: new Date(),
    });
    await billsRepository.save({
      title: 'Jantar',
      payer: Payer.FIRST,
      priceInCents: 400,
      date: new Date(),
    });
    await billsRepository.save({
      title: 'Café',
      payer: Payer.SECOND,
      priceInCents: 300,
      date: new Date(),
    });
  };

  it('should get all bills', async () => {
    await createExampleBills();
    const bills = await billsService.findAll();
    expect(bills).toBeDefined();
    expect(bills.length).toBe(4);
    expect(bills[0].payer).toBe(Payer.FIRST);
    expect(bills[1].payer).toBe(Payer.SECOND);
    expect(bills[2].payer).toBe(Payer.FIRST);
    expect(bills[3].payer).toBe(Payer.SECOND);
    expect(bills[0].priceInCents).toBe(100);
    expect(bills[1].priceInCents).toBe(200);
    expect(bills[2].priceInCents).toBe(400);
    expect(bills[3].priceInCents).toBe(300);
    expect(bills[0].title).toBe('Almoço');
    expect(bills[1].title).toBe('Lanche');
    expect(bills[2].title).toBe('Jantar');
    expect(bills[3].title).toBe('Café');
    expect(bills[0].date).toBeInstanceOf(Date);
    expect(bills[1].date).toBeInstanceOf(Date);
    expect(bills[2].date).toBeInstanceOf(Date);
    expect(bills[3].date).toBeInstanceOf(Date);
  });

  describe('bills calculate', () => {
    beforeEach(async () => {
      await createExampleBills();
    });

    it('should calculate all bills and total = 0', async () => {
      const { total, debtor, creditor } = await billsService.calculate();
      expect(total).toBe(0);
      expect(debtor).toBe(null);
      expect(creditor).toBe(null);
    });

    it('should calculate all bills and total = 300 and debtor FIRST', async () => {
      await billsRepository.save({
        title: 'Café',
        payer: Payer.SECOND,
        priceInCents: 300,
        date: new Date(),
      });
      const { total, debtor, creditor } = await billsService.calculate();
      expect(total).toBe(300);
      expect(debtor).toBe(Payer.FIRST);
      expect(creditor).toBe(Payer.SECOND);
    });

    it('should calculate all bills and total = 300 and debtor SECOND', async () => {
      await billsRepository.save({
        title: 'Café',
        payer: Payer.FIRST,
        priceInCents: 300,
        date: new Date(),
      });
      const { total, debtor, creditor } = await billsService.calculate();
      expect(total).toBe(300);
      expect(debtor).toBe(Payer.SECOND);
      expect(creditor).toBe(Payer.FIRST);
    });
  });
});
