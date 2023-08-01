import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesCartsAndItems1690925420795
  implements MigrationInterface
{
  name = 'CreateTablesCartsAndItems1690925420795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "carts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" double precision NOT NULL, "subtotal" double precision NOT NULL, "discount" double precision, "taxes" double precision, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "carts_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" bigint NOT NULL, "cart_id" uuid NOT NULL, "item_id" uuid NOT NULL, CONSTRAINT "cart_item" UNIQUE ("cart_id", "item_id"), CONSTRAINT "PK_8694f6220058d48e65565a4ec62" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "price" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_items" ADD CONSTRAINT "FK_38480c772442a6547fdb82c412b" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_items" ADD CONSTRAINT "FK_a0143eec73abb3a955b1cc97509" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carts_items" DROP CONSTRAINT "FK_a0143eec73abb3a955b1cc97509"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts_items" DROP CONSTRAINT "FK_38480c772442a6547fdb82c412b"`,
    );
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "carts_items"`);
    await queryRunner.query(`DROP TABLE "carts"`);
  }
}
