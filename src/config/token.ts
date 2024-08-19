import { TokensPageFilters } from "@/models/token";

export const defaultSlippagePercent = 3;
export const defualtPriorityFee = 0.001;
export const baseEthAddr = "0x4200000000000000000000000000000000000006";
export const tokenCarouselLength = 14;
export const validTokensPageFilters = [
  TokensPageFilters.New,
  TokensPageFilters.Trending,
  TokensPageFilters.Volume,
  TokensPageFilters.Transactions,
  TokensPageFilters.Comments,
  TokensPageFilters.Votes,
];
