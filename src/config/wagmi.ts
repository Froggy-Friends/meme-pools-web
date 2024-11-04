import { isProd, walletConnectProjectId } from "./env";
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia, baseSepolia, base } from '@reown/appkit/networks'

if (!walletConnectProjectId) {
  throw new Error('Project ID is not defined')
}

export const wagmiChains = {
  eth: isProd ? mainnet : sepolia,
  base: isProd ? base : baseSepolia,
};
const networks = [wagmiChains.eth, wagmiChains.base];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId: walletConnectProjectId,
  networks,
});
