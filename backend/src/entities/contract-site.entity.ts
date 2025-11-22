import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';
import { Site } from './site.entity';

@Entity('contract_sites')
export class ContractSite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contract, contract => contract.contract_sites, { onDelete: 'CASCADE' })
  contract: Contract;

  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  site: Site;

  @CreateDateColumn()
  created_at: Date;
}
