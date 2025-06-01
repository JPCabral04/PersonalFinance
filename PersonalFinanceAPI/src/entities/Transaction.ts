import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Account } from './Account';
import { TransactionType } from '../enums/TransactionType.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType!: TransactionType;

  @ManyToOne(() => Account, (account) => account.outgoingTransactions, {
    onDelete: 'CASCADE',
  })
  originAccount!: Account;

  @ManyToOne(() => Account, (account) => account.incomingTransactions, {
    onDelete: 'CASCADE',
  })
  destinationAccount!: Account;

  @Column({ type: 'numeric' })
  amount!: number;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  transactionDate!: Date;
}
