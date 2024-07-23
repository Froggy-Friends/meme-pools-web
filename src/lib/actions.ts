"use server";

export const launchCoin = async (formData: FormData) => {
  const name = formData.get("name");
  const ticker = formData.get("ticker");
  const description = formData.get("description");
  const image = formData.get("image");
  const twitter = formData.get("twitter");
  const telegram = formData.get("telegram");
  const website = formData.get("website");

};
