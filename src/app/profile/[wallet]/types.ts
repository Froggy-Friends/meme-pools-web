import { WalletAddress } from "@/lib/types";

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

export type WagmiConnector = {
  id: string;
  name: string;
  type: string;
  uid: string;
};

export type WagmiConnectionsValue = {
  accounts: WalletAddress[];
  chainId: number;
  connector: WagmiConnector;
};
