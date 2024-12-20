import { delegate } from "@/config/delegate";
import {
  froggyFriendsAddress,
  baseFroggyFriendsAddress,
  tadpoleAddress,
} from "@/config/env";
import { Address } from "viem";

export const getDelegations = async (address: Address) => {
  if (!address) return [];

  const incomingDelegations = await delegate.getIncomingDelegations(address);

  const filteredDelegations = incomingDelegations.filter((delegation) => {
    return (
      delegation.type === "ALL" ||
      (delegation.type === "CONTRACT" &&
        delegation.contract === froggyFriendsAddress) ||
      (delegation.type === "ERC721" &&
        delegation.contract === froggyFriendsAddress) ||
      (delegation.type === "ERC404" &&
        delegation.contract === tadpoleAddress) ||
      (delegation.type === "CONTRACT" &&
        delegation.contract === tadpoleAddress) ||
      (delegation.type === "ERC721" &&
        delegation.contract === baseFroggyFriendsAddress) ||
      (delegation.type === "CONTRACT" &&
        delegation.contract === baseFroggyFriendsAddress)
    );
  });

  const delegatedWallets = filteredDelegations.map(
    (delegation) => delegation.from
  );

  return delegatedWallets;
};
