import { TokenFilter } from "@/models/token";

export const defaultSlippagePercent = 15;
export const defualtPriorityFee = 0.001;
export const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const tokenCarouselLength = 14;
export const validTokenFilter = [
  TokenFilter.New,
  TokenFilter.Trending,
  TokenFilter.Volume,
  TokenFilter.Transactions,
  TokenFilter.Comments,
  TokenFilter.Votes,
];
