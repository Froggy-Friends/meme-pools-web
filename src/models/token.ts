export enum TokenVoteStatus {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote",
}

export type TokenVoteData = {
  upvotes: number;
  downvotes: number;
  total: number;
};
