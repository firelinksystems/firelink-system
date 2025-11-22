import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('asset_types')
export class AssetType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 12 })
  inspection_frequency_months: number;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany(() => Asset, asset => asset.asset_type)
  assets: Asset[];
}
