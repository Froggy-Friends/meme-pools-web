/*
  Warnings:

  - Added the required column `marketCap` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "marketCap" INTEGER NOT NULL;
