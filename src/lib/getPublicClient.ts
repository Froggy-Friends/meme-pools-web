import { createPublicClient, http } from 'viem'
import { Chain } from '@/models/chain'
import { getViemChain } from './chains'
import { getChainRpcUrl } from './chains'

export const getViemClient = (chain: Chain) => {
  return createPublicClient({
    chain: getViemChain(chain),
    transport: http(getChainRpcUrl(chain) as string),
  })
}