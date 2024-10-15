/*
  Warnings:

  - You are about to alter the column `price` on the `Trades` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(26,18)`.
  - You are about to alter the column `amount` on the `Trades` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(26,18)`.

*/
-- AlterTable
ALTER TABLE "Trades" ALTER COLUMN "price" SET DATA TYPE DECIMAL(26,18),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(26,18);
