import { Payer } from '../entities/bill.entity';

type CalculateBillsDto = {
  total: number;
  debtor: Payer;
  creditor: Payer;
};

export { CalculateBillsDto };
