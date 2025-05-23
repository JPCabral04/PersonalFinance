import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Account } from './Account';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // @OneToMany(() => Account, (account) => account.user, {
  //   cascade: ['remove'],
  // })
  // accounts: Account[];
}
