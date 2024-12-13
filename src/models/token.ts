export enum TokenVoteStatus {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote",
}

export type TokenVoteData = {
  upvotes: number;
  downvotes: number;
  total: number;
};

export enum TokenFilter {
  New = "new",
  Trending = "trending",
  Volume = "volume",
  Transactions = "transactions",
  Comments = "comments",
  Votes = "votes",
}

export enum TokenOrigin {
  Internal = "internal",
  External = "external",
}

export enum TokenType {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
}
