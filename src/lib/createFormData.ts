import { LaunchFormValues } from "@/components/launch/LaunchCoinForm";

export const createFormData = (data: LaunchFormValues) => {
  const formData = new FormData();

  formData.set("name", data.name);
  formData.set("ticker", data.ticker);
  formData.set("reservedAmount", data.reservedAmount);
  formData.set("description", data.description);
  formData.set("image", data.image[0]);
  data.twitter && formData.set("twitter", data.twitter);
  data.telegram && formData.set("telegram", data.telegram);
  data.website && formData.set("website", data.website);
  data.discord && formData.set("discord", data.discord);
  data.other && formData.set("other", data.other);

  return formData;
};
