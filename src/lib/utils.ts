export const simulateCreateToken = () => {
  let tokenId = Math.floor(Math.random() * 1000000);
  let tokenAddress = "0x532f27101965dd16442E59d40670FaF5eBB142E4";

  return {
    tokenId,
    tokenAddress,
  };
};


