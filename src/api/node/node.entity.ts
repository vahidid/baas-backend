import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Network } from '../network/network.entity';

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
