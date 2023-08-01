import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItemEntity } from './CartItemEntity';

@Entity('items')
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  public name!: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  public price!: number;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.item)
  public cartItems!: CartItemEntity[];
}
