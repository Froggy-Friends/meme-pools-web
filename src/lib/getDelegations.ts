import { delegate } from "@/config/delegate";
import { froggyFriendsAddress } from "@/config/env";
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
        delegation.contract === froggyFriendsAddress)
    );
  });

  const delegatedWallets = filteredDelegations.map(
    (delegation) => delegation.from
  );

  return delegatedWallets;
};
