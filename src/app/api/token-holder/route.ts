import { TokenType } from "@/models/token";
import { Address } from "viem";
import { checkIsAHolder } from "@/lib/checkIsAHolder";
import { getDelegations } from "@/lib/getDelegations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get("tokenAddress");
  const type = searchParams.get("type");
  const address = searchParams.get("address");

  const delegations = await getDelegations(address as `0x${string}`);

  const mainWalletIsHolder = await checkIsAHolder(
    tokenAddress as Address,
    address as Address,
    type as TokenType
  );

  const delegatedHolderPromises = delegations.map((delegatedAddress) =>
    checkIsAHolder(
      tokenAddress as Address,
      delegatedAddress as Address,
      type as TokenType
    )
  );
  const delegatedResults = await Promise.all(delegatedHolderPromises);

  const isHolder =
    mainWalletIsHolder || delegatedResults.some((result) => result);

  return Response.json({ isHolder });
}
