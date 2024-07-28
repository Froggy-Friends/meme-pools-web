"use client";

import useCreateToken from "@/hooks/useCreateToken";
import { launchCoin } from "@/lib/actions";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import FormSubmitButton from "./FormSubmitButton";

export default function LaunchCoinForm() {
  const { address, isConnected } = useAccount();

  const handleSubmit = async (formData: FormData) => {
    try {
      if (!address || !isConnected) {
        throw new Error("Wallet not connected");
      }
  
      const errorMessage = await launchCoin(formData, address!);
  
      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        toast.success("Token successfully created!");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <section className="w-[400px] mx-auto">
      <h1 className="mx-auto text-2xl mb-6">Launch a New Coin</h1>

      <form
        action={handleSubmit}
        className="flex flex-col"
      >
        <label htmlFor="name" className="mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <label htmlFor="ticker" className="mb-1">
          Ticker
        </label>
        <input
          id="ticker"
          name="ticker"
          type="text"
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <label htmlFor="description" className="mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="ring-1 ring-black p-2 rounded-md mb-2 h-32"
          required
        />

        <label htmlFor="image" className="mb-1">
          Image
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="ring-1 ring-black p-2 rounded-md mb-2"
          required
        />

        <label htmlFor="twitter" className="mb-1">
          Twitter link
        </label>
        <input
          id="twitter"
          name="twitter"
          type="url"
          pattern="https://x.com/*"
          placeholder="optional.."
          className="ring-1 ring-black p-2 rounded-md mb-2"
        />

        <label htmlFor="twitter" className="mb-1">
          Telegram link
        </label>
        <input
          id="telegram"
          name="telegram"
          type="text"
          placeholder="optional.."
          className="ring-1 ring-black p-2 rounded-md mb-2"
        />

        <label htmlFor="website" className="mb-1">
          Website
        </label>
        <input
          id="website"
          name="website"
          type="url"
          pattern="https://.*"
          placeholder="optional.."
          className="ring-1 ring-black p-2 rounded-md mb-2"
        />

        <FormSubmitButton className="p-2 mt-2 border-[1px] border-black rounded-lg flex justify-center active:scale-[0.97]">
          <p className="py-1 font-semibold">Launch Coin</p>
        </FormSubmitButton>
      </form>
    </section>
  );
}
