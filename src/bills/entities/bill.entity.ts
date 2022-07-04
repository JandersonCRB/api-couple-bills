import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Payer {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
}

@Entity({ name: 'bills' })
class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 40 })
  title: string;

  @Column({ type: 'integer' })
  priceInCents: number;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: Payer,
  })
  payer: Payer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export { Payer, Bill };
