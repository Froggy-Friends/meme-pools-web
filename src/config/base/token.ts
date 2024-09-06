import { TokenFilter } from "@/models/token";

export const defaultSlippagePercent = 3;
export const defualtPriorityFee = 0.001;
export const baseEthAddr = "0x4200000000000000000000000000000000000006";
export const tokenCarouselLength = 14;
export const validTokenFilter = [
  TokenFilter.New,
  TokenFilter.Trending,
  TokenFilter.Volume,
  TokenFilter.Transactions,
  TokenFilter.Comments,
  TokenFilter.Votes,
];
