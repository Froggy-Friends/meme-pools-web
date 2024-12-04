import { http } from "viem";
import { DelegateV2 } from "@delegatexyz/sdk";
import { isProd } from "./env";

const RPC_URL = isProd
  ? process.env.ETH_MAINNET_RPC_URL
  : process.env.SEPOLIA_RPC_URL;

export const delegate = new DelegateV2(http(RPC_URL));
