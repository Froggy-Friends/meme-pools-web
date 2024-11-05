import { Chain } from "@/models/chain";

export function getWalletType(address: string | null | undefined): "solana" | "eth" | undefined {
  if (!address) return undefined;
  // Solana addresses are 44 characters long and base58 encoded
  const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  return isSolanaAddress ? "solana" : "eth";
}

export function isWalletChainCompatible(
  walletAddress: string | null | undefined,
  chain: Chain
): boolean {
  if (!walletAddress) return true; // No wallet connected is considered compatible
  const walletType = getWalletType(walletAddress);
  return (
    (walletType === "solana" && chain === Chain.Solana) ||
    (walletType === "eth" && (chain === Chain.Eth || chain === Chain.Base))
  );
}
