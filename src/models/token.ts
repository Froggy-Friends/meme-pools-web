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
