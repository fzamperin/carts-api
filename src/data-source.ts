import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ItemEntity } from './entities/ItemEntity';
import { CartEntity } from './entities/CartEntity';
import { resolve } from 'path';
import { CartItemEntity } from './entities/CartItemEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  logging: false,
  entities: [ItemEntity, CartEntity, CartItemEntity],
  migrations: [resolve(__dirname, 'migrations', '*{.ts,.js}')],
});
