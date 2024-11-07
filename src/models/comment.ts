export enum CommentLikeStatus {
  LIKE = "like",
  DISLIKE = "dislike",
}

export enum CommentAndTradesViews {
  HOLDERS = "holders",
  COMMENTS = "comments",
  TRADES = "trades",
  MEMES = "memes",
}

export type CommentAndTradesView = "holders" | "comments" | "trades" | "memes";
