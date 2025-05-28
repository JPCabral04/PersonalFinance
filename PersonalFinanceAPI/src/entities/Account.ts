import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Transaction } from './Transaction';
import { AccountType } from '../enums/AccountType.enum';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType!: AccountType;

  @Column({
    type: 'numeric',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
    default: 0,
  })
  balance!: number;

  @ManyToOne(() => User, (user) => user.accounts)
  user!: User;

  @OneToMany(() => Transaction, (t) => t.originAccount, { nullable: true })
  outgoingTransactions?: Transaction[];

  @OneToMany(() => Transaction, (t) => t.destinationAccount, { nullable: true })
  incomingTransactions?: Transaction[];
}
