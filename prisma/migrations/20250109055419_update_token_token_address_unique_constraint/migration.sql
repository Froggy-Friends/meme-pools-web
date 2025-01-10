/*
  Warnings:

  - A unique constraint covering the columns `[tokenAddress,chain]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ApeClaim" DROP CONSTRAINT "token_address_fkey";

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "token_address_fkey";

-- DropIndex
DROP INDEX "Token_tokenAddress_key";

-- AlterTable
ALTER TABLE "ApeClaim" ALTER COLUMN "chain" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Claim" ALTER COLUMN "chain" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Token_tokenAddress_chain_key" ON "Token"("tokenAddress", "chain");

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "token_address_fkey" FOREIGN KEY ("tokenAddress", "chain") REFERENCES "Token"("tokenAddress", "chain") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ApeClaim" ADD CONSTRAINT "token_address_fkey" FOREIGN KEY ("tokenAddress", "chain") REFERENCES "Token"("tokenAddress", "chain") ON DELETE NO ACTION ON UPDATE NO ACTION;
