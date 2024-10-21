-- AlterTable
ALTER TABLE "Trades" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(28,18);

-- RenameIndex
ALTER INDEX "unique_username" RENAME TO "User_unique_username";
