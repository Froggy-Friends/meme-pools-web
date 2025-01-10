-- CreateTable
CREATE TABLE "ApeClaim" (
    "id" UUID NOT NULL,
    "nftId" INTEGER NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ape_claim_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApeClaim" ADD CONSTRAINT "token_address_fkey" FOREIGN KEY ("tokenAddress") REFERENCES "Token"("tokenAddress") ON DELETE NO ACTION ON UPDATE NO ACTION;
