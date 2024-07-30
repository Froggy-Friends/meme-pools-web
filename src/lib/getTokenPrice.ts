import Moralis from "moralis";

const BASE_CHAIN_ID = "0x2105";

export default async function getTokenPrice(address: string) {
  const res = await Moralis.EvmApi.token.getTokenPrice({
    chain: BASE_CHAIN_ID,
    address,
  });
  return res.toJSON();
}
