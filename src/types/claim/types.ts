export type ApeData = { apeId: string; collection: "bayc" | "mayc" };

export type ApeWalletData = { apes: ApeData[]; baycIds: number[]; maycIds: number[] };