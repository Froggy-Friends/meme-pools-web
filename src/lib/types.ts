import { Token, User } from '@prisma/client';
export type TokenWithCreator = Token & { creator: User };

export type Address = `0x${string}`;

export type SearchParams = { [key: string]: string | string[] | undefined };




