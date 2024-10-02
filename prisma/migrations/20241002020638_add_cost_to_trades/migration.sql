/*
  Warnings:

  - Added the required column `cost` to the `Trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trades" ADD COLUMN     "cost" DECIMAL(10,2) NOT NULL;
