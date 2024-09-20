import { Token, User } from "@prisma/client";

export type TokenWithCreator = Token & { user: User } & {
  _count: { Comment: number };
};

export type SearchParams = { [key: string]: string | string[] | undefined };
