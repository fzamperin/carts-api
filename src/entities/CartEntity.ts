import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItemEntity } from './CartItemEntity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  public total!: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  public subtotal!: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  public discount?: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  public taxes?: number;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  public cartItems!: CartItemEntity[];
}
