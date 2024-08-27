export const sliceAddress = (address: string) => {
    let substringOne = "";
    let subStringTwo = "";
    let finalString = "";
    let length;
    let shortenedLength;
  
    if (!address) {
      return;
    }
  
    if (address.length) {
      length = address.length;
      shortenedLength = address.length - 5;
    }
  
    substringOne = address.substring(0, 6);
  
    if (length && shortenedLength) {
      subStringTwo = address.substring(shortenedLength, length);
    }
  
    finalString = substringOne + "..." + subStringTwo;
  
    return finalString;
  };