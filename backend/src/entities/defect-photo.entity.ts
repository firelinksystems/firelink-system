import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Defect } from './defect.entity';
import { User } from './user.entity';

@Entity('defect_photos')
export class DefectPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Defect, defect => defect.photos, { onDelete: 'CASCADE' })
  defect: Defect;

  @Column()
  photo_url: string;

  @Column({ nullable: true })
  caption: string;

  @ManyToOne(() => User)
  uploaded_by: User;

  @CreateDateColumn()
  created_at: Date;
}
