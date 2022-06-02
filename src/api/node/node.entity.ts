import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Network } from '../network/network.entity';
import { NodeStatus } from './node.types';

@Entity()
export class Node {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
  public node_id: string;

  @Column({ type: 'varchar', length: 120 })
  public node_name: string;

  @Column({ type: 'varchar', length: 120 })
  public grpc_port: number;

  @Column({ type: 'varchar', length: 120 })
  public libp2p_port: number;

  @Column({ type: 'varchar', length: 120 })
  public jsonrpc_port: number;

  @Column({ type: 'varchar', length: 120, nullable: true })
  public pid?: number;

  @Column({ type: 'enum', enum: NodeStatus, default: NodeStatus.Deactive })
  public status?: NodeStatus;

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
  @ManyToOne(() => Network, (network) => network.nodes)
  public network: Network;
}
