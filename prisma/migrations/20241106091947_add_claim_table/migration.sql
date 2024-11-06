-- CreateTable
CREATE TABLE "Claim" (
    "id" UUID NOT NULL,
    "frogId" INTEGER NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "claimerAddress" TEXT,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "token_address_fkey" FOREIGN KEY ("tokenAddress") REFERENCES "Token"("tokenAddress") ON DELETE NO ACTION ON UPDATE NO ACTION;
