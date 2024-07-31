import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { User, WagmiConnectionsValue, WalletAddress } from "./types";
import { fetchUser } from "./actions";

export const getUserFromCookies = async (cookieStore: ReadonlyRequestCookies) => {
    let wagmiCookies: Storage | null = null;
    let account = "";
    let userAddress = "";
    let user: User | null | undefined = null;
    const userCookies = cookieStore.get("wagmi.store");
  
    if (userCookies) {
      wagmiCookies = JSON.parse(userCookies.value!);
    }
  
    if (wagmiCookies) {
      account = wagmiCookies.state.connections.value
        .flat()
        .map((data: WagmiConnectionsValue) => {
          return data.accounts;
        });
    }
  
    if (account.length > 1) {
      userAddress = account[1].toString();
    }
  
    if (userAddress) {
      user = await fetchUser(userAddress as WalletAddress);
    }
  
    return user
  };