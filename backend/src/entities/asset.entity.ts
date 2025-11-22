import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Site } from './site.entity';
import { AssetType } from './asset-type.entity';
import { JobAsset } from './job-asset.entity';
import { Defect } from './defect.entity';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Site, site => site.assets, { onDelete: 'CASCADE' })
  site: Site;

  @ManyToOne(() => AssetType)
  asset_type: AssetType;

  @Column()
  name: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  model: string;

  @Column({ unique: true, nullable: true })
  serial_number: string;

  @Column({ type: 'date', nullable: true })
  installation_date: Date;

  @Column({ type: 'date', nullable: true })
  last_inspection_date: Date;

  @Column({ type: 'date', nullable: true })
  next_inspection_date: Date;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  location_description: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => JobAsset, jobAsset => jobAsset.asset)
  job_assets: JobAsset[];

  @OneToMany(() => Defect, defect => defect.asset)
  defects: Defect[];
}
