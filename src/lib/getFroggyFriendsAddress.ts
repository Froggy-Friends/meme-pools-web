import { baseFroggyFriendsAddress, froggyFriendsAddress } from "@/config/env";
import { Chain } from "@/models/chain";

export const getFroggyFriendsAddress = (chain: Chain) => {
  return chain === Chain.Eth ? froggyFriendsAddress : baseFroggyFriendsAddress;
};
