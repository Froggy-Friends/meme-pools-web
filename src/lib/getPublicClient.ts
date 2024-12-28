import { createPublicClient, http } from 'viem'
import { mainnet, base } from '@reown/appkit/networks'
import { Chain } from '@/models/chain'

export const getViemClient = (chain: Chain) => {
  return createPublicClient({
    chain: chain === Chain.Eth ? mainnet : base,
    transport: http(
      chain === Chain.Eth
        ? process.env.NEXT_PUBLIC_ETH_MAINNET_RPC_URL
        : process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL
    ),
  })
}