import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Network } from '../network/network.entity';
import { VolumeStatus } from './volume.types';

@Entity()
export class Volume {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
  public title: string;

  @Column({ type: 'varchar', length: 120 })
  public path: string;

  @Column({ type: 'enum', enum: VolumeStatus, default: VolumeStatus.Created })
  public status?: VolumeStatus;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  /**
   * Relations
   */
}
