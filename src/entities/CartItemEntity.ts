import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CartEntity } from './CartEntity';
import { ItemEntity } from './ItemEntity';

@Entity('carts_items')
@Unique('cart_item', ['cart_id', 'item_id'])
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'int8', nullable: false })
  public quantity!: number;

  @Column({ nullable: false })
  public cart_id!: string;

  @Column({ nullable: false })
  public item_id!: string;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'cart_id' })
  public cart!: CartEntity;

  @ManyToOne(() => ItemEntity, (item) => item.cartItems)
  @JoinColumn({ name: 'item_id' })
  public item!: ItemEntity;
}
