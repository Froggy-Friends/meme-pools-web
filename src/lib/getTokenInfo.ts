export const getTokenInfo = (formData: FormData) => {
  const name = formData.get("name") as string;
  const ticker = formData.get("ticker") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as File;
  const twitter = formData.get("twitter") as string;
  const telegram = formData.get("telegram") as string;
  const website = formData.get("website") as string;

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
