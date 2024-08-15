import { Address } from "@/lib/types";

export type UserParams = {
  name?: string;
  wallet: string;
  imageUrl?: string;
  email?: string;
};

export type User = {
  id: string;
  name: string;
  ethAddress: string | null;
  solAddress: string | null;
  imageUrl: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type WagmiConnector = {
  id: string;
  name: string;
  type: string;
  uid: string;
};

export type WagmiConnectionsValue = {
  accounts: Address[];
  chainId: number;
  connector: WagmiConnector;
};
