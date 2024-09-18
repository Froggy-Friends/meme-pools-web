export enum Channel {
  Comment = "comment", // ✓
  CommentLikes = "comment-likes",
  CommentDislikes = "comment-dislikes",
  Upvotes = "votes", // ✓
  Downvotes = "downvotes", // ✓
  Follow = "follow", // ✓
  Unfollow = "unfollow", // ✓
  CreateToken = "create-token", // ? - create token is failing
  Buy = "buy", // TODO - implement when buy/sell is implemented
  Sell = "sell", // TODO - implement when buy/sell is implemented
}
