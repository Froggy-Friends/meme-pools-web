/*
  Warnings:

  - You are about to drop the column `twitterUsername` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "unique_twitter_username";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "twitterUsername";
