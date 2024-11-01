/*
  Warnings:

  - You are about to drop the column `cost` on the `Trades` table. All the data in the column will be lost.
  - Added the required column `nativeCost` to the `Trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionHash` to the `Trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usdCost` to the `Trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trades" DROP COLUMN "cost",
ADD COLUMN     "nativeCost" DECIMAL(26,18) NOT NULL,
ADD COLUMN     "transactionHash" TEXT NOT NULL,
ADD COLUMN     "usdCost" DECIMAL(26,18) NOT NULL;
