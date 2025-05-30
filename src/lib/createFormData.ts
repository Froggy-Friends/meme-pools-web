import { CreateFormValues } from "@/components/create/CreateCoinForm";

export const createFormData = (data: CreateFormValues) => {
  const formData = new FormData();

  formData.set("name", data.name);
  formData.set("ticker", data.ticker);
  formData.set("reservedAmount", data.reservedAmount);
  formData.set("description", data.description);
  formData.set("image", data.image[0]);
  if (data.twitter) {
    formData.set("twitter", data.twitter);
  }
  if (data.telegram) {
    formData.set("telegram", data.telegram);
  }
  if (data.website) {
    formData.set("website", data.website);
  }
  if (data.discord) {
    formData.set("discord", data.discord);
  }
  if (data.other) {
    formData.set("other", data.other);
  }

  return formData;
};
