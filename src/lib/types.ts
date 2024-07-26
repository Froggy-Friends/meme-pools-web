export type CreateTokenParams = {
    amount: number;
    name: string | FormDataEntryValue;
    symbol: string | FormDataEntryValue;
}

export type UserParams = {
    name?: string;
    wallet: `0x${string}`;
    imageUrl?: string;
    email?: string;
}