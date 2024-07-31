export type WalletAddress = `0x${string}`;

export type CreateTokenParams = {
  amount: number;
  name: string | FormDataEntryValue;
  symbol: string | FormDataEntryValue;
};

export type UserParams = {
  name?: string;
  wallet: WalletAddress;
  imageUrl?: string;
  email?: string;
};

export type User = {
  id: string;
  name: string;
  wallet: string;
  imageUrl: string | null;
  email: string | null;
  createdAt: Date;
  updatedat: Date | null;
};

export type Token = {
  id: string;
  tokenId: number;
  ticker: string;
  description: string;
  image: string;
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  tokenAddress: string;
};

export type SearchParams = { [key: string]: string | string[] | undefined };

export type WagmiConnector = {
  id: string;
  name: string;
  type: string;
  uid: string;
}

export type WagmiConnectionsValue = {
  accounts: WalletAddress[];
  chainId: number;
  connector: WagmiConnector;
}


