import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { Asset } from './asset.entity';
import { Job } from './job.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer.sites, { onDelete: 'CASCADE' })
  customer: Customer;

  @Column()
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  postcode: string;

  @Column({ nullable: true })
  contact_name: string;

  @Column({ nullable: true })
  contact_phone: string;

  @Column({ nullable: true })
  contact_email: string;

  @Column({ type: 'text', nullable: true })
  site_instructions: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => Asset, asset => asset.site)
  assets: Asset[];

  @OneToMany(() => Job, job => job.site)
  jobs: Job[];
}
