import { Chain, ChainConfigs } from "@/models/chain";
import {
  baseChainId,
  ethChainId,
  solanaChainId,
  etherscanUrl,
  baseExplorerUrl,
  solanaExplorerUrl,
  apeChainExplorerUrl,
  apeChainId,
} from "./env";

export const solanaLogo =
  "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/Solana-Logo-aJnrhtpHiDx3ahUVRx1b8nn69drIar.svg";
export const baseLogo =
  "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/base-logo-h6ywtOYceBvMjwrnwslIATEduntS24.svg";
export const ethLogo =
  "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/eth-logo-Hb4N1iT2IhzDzdUo8qzjk32CrOgdtR.svg";
export const apeChainLogo =
  "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/apechain-logo-8ylfhIORJqNBckxSpx1U0pDzL0CfE2.jpeg";
export const apeCoinLogo =
  "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/apecoin-ape-ape-logo-NLaPDPnIsLrXcW9oTDob7k2voqNW9i.png";

export const ethPriceUrl = "https://api.coinbase.com/v2/prices/ETH-USD/spot";
export const apePriceUrl = "https://api.coinbase.com/v2/prices/APE-USD/spot";
export const solanaPriceUrl = "https://api.coinbase.com/v2/prices/SOL-USD/spot";

export const chainConfigs: ChainConfigs = {
  eth: {
    name: Chain.Eth,
    id: ethChainId,
    explorerUrl: etherscanUrl,
    logo: ethLogo,
  },
  base: {
    name: Chain.Base,
    id: baseChainId,
    explorerUrl: baseExplorerUrl,
    logo: baseLogo,
  },
  solana: {
    name: Chain.Solana,
    id: solanaChainId,
    explorerUrl: solanaExplorerUrl,
    logo: solanaLogo,
  },
  apechain: {
    name: Chain.ApeChain,
    id: apeChainId,
    explorerUrl: apeChainExplorerUrl,
    logo: apeChainLogo,
  },
};
