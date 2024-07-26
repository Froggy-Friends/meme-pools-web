export const shortenAddress = (transaction: `0x${string}`) => {
  let substringOne = "";
  let subStringTwo = "";
  let finalString = "";
  let length;
  let shortenedLength;

  if (!transaction) {
    return;
  }

  if (transaction.length) {
    length = transaction.length;
    shortenedLength = transaction.length - 5;
  }

  substringOne = transaction.substring(0, 4);

  if (length && shortenedLength) {
    subStringTwo = transaction.substring(shortenedLength, length);
  }

  finalString = substringOne + "..." + subStringTwo;

  return finalString;
};

export const simulateCreateToken = () => {
  let tokenId = Math.floor(Math.random() * 1000000);
  let tokenAddress = "0x532f27101965dd16442E59d40670FaF5eBB142E4";

  return {
    tokenId,
    tokenAddress,
  };
};
