import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Customer } from './customer.entity';
import { Job } from './job.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  CUSTOMER = 'customer'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password_hash: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.TECHNICIAN })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  @Exclude()
  mfa_secret: string;

  @Column({ nullable: true })
  last_login: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => Customer, customer => customer.account_manager)
  managed_customers: Customer[];

  @OneToMany(() => Job, job => job.assigned_technician)
  assigned_jobs: Job[];

  @OneToMany(() => Job, job => job.created_by)
  created_jobs: Job[];
}
