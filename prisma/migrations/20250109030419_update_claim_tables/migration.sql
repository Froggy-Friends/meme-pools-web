-- AlterTable
ALTER TABLE "ApeClaim" ADD COLUMN     "chain" TEXT NOT NULL DEFAULT 'apechain',
ADD COLUMN     "claimerAddress" TEXT;

-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "chain" TEXT NOT NULL DEFAULT 'base';
