import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
// import { Transaction } from './Transaction';
import { AccountType } from '../enums/AccountType.enum';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType!: AccountType;

  @Column({ type: 'numeric', default: 0 })
  balance!: number;

  // @OneToMany(() => Transaction, (t) => t.originAccount)
  // transactions: Transaction[];

  @ManyToOne(() => User, (user) => user.accounts, {
    nullable: false,
  })
  user!: User;
}
