import { Chain, ChainConfigs } from "@/models/chain";
import { baseChainId, ethChainId, solanaChainId } from "./env";

export const solanaLogo =
  "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/Solana-Logo-aJnrhtpHiDx3ahUVRx1b8nn69drIar.svg";
export const baseLogo =
  "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/base-logo-h6ywtOYceBvMjwrnwslIATEduntS24.svg";
export const ethLogo =
  "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/eth-logo-Hb4N1iT2IhzDzdUo8qzjk32CrOgdtR.svg";

export const chainConfigs: ChainConfigs = {
  eth: {
    name: Chain.Eth,
    id: ethChainId,
  },
  base: {
    name: Chain.Base,
    id: baseChainId,
  },
  solana: {
    name: Chain.Solana,
    id: solanaChainId,
  },
};
