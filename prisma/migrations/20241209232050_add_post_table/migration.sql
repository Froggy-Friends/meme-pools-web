/*
  Warnings:

  - You are about to drop the column `caption` on the `Meme` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Meme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meme" DROP COLUMN "caption",
ADD COLUMN     "postId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "origin" TEXT NOT NULL DEFAULT 'internal';

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meme" ADD CONSTRAINT "post_id_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "user_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "token_id_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
