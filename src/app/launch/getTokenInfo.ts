export const getTokenInfo = (formData: FormData) => {
  const name = formData.get("name");
  const ticker = formData.get("ticker");
  const description = formData.get("description");
  const image = formData.get("image") as File;
  const twitter = formData.get("twitter");
  const telegram = formData.get("telegram");
  const website = formData.get("website");

  const data = {
    name: name,
    ticker: ticker,
    description: description,
    image: image,
    twitter: twitter,
    telegram: telegram,
    website: website,
  };

  return data;
};
