"use client";

import useCreateToken from "@/hooks/useCreateToken";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import { parseUnits } from "viem";
import { launchCoin } from "@/actions/launch/actions";
import FormSubmitButton from "../FormSubmitButton";
import LaunchCoinFormModal from "./LaunchCoinFormModal";
import { useForm } from "react-hook-form";
import { createFormData } from "@/lib/createFormData";
import { useChain } from "@/context/chain";
import { Chain } from "@/models/chain";
import Image from "next/image";
import { cn } from "@nextui-org/react";
import { solanaLogo, ethLogo } from "@/config/chains";
import { useRouter } from "next/navigation";
import LaunchCoinToast from "./LaunchCoinToast";
import { GrRefresh } from "react-icons/gr";
import { useRef } from "react";

export type LaunchFormValues = {
  name: string;
  ticker: string;
  reservedAmount: string;
  description: string;
  image: File[];
  twitter?: string;
  telegram?: string;
  website?: string;
  discord?: string;
  other?: string;
};

export default function LaunchCoinForm() {
  const { address, isConnected } = useAccount();
  const { createToken } = useCreateToken();
  const { chain } = useChain();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    resetField,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LaunchFormValues>();
  const inputStyles =
    "h-10 w-[410px] tablet:w-[350px] laptop:w-[430px] desktop:w-[450px] px-2 mb-5 rounded-lg outline-none bg-dark-gray focus:ring-2 ring-gray";

  const onSubmit = handleSubmit(async (data: LaunchFormValues) => {
    const formData = createFormData(data);
    const reservedAmount = parseUnits(data.reservedAmount, 18) || BigInt(0);

    try {
      if (!address || !isConnected) {
        throw new Error("Wallet not connected");
      }

      const tokenDetails = await createToken({
        reservedAmount: reservedAmount,
        name: data.name,
        symbol: data.ticker,
      });

      if (!tokenDetails) {
        return;
      }

      const errorMessage = await launchCoin(
        formData,
        address,
        tokenDetails.tokenAddress,
        tokenDetails.creator,
        chain.name
      );

      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        <LaunchCoinToast txHash={tokenDetails.txHash} />;
      }

      reset();
      router.push(`/${chain.name}/token/${tokenDetails.tokenAddress}`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  });

  return (
    <section className="mt-20">
      <form onSubmit={onSubmit} className="flex flex-col items-center max-w-[925px] mx-auto" ref={formRef}>
        <button
          onClick={() => formRef.current?.reset()}
          className="flex items-center self-end gap-x-2 mb-5 bg-dark-gray rounded-3xl px-4 py-2 hover:bg-gray active:scale-[0.97] transition"
        >
          <p>Reset</p>
          <GrRefresh size={18} />
        </button>
        <div className="flex flex-col tablet:flex-row gap-x-4 laptop:gap-x-10">
          <div className="flex flex-col">
            <div className="flex gap-x-1">
              <label htmlFor="name" className="mb-1">
                Name
              </label>
              <span className="text-green mr-2">*</span>
              {errors.name && <p className="text-red">{errors.name.message}</p>}
            </div>
            <input
              {...register("name", {
                required: "Token name is required",
                maxLength: {
                  value: 50,
                  message: "Token name must be 50 characters or less",
                },
              })}
              id="name"
              type="text"
              className={inputStyles}
              autoComplete="off"
            />

            <div className="flex gap-x-1">
              <label htmlFor="ticker" className="mb-1">
                Ticker
              </label>
              <span className="text-green mr-2">*</span>
              {errors.ticker && <p className="text-red">{errors.ticker.message}</p>}
            </div>

            <div className="relative">
              <input
                {...register("ticker", {
                  required: "Token ticker is required",
                  maxLength: {
                    value: 50,
                    message: "Token ticker must be 50 characters or less",
                  },
                })}
                id="ticker"
                type="text"
                className={cn(inputStyles, "pl-7")}
                autoComplete="off"
              />
              <div
                className="absolute inset-y-0 left-0 pl-2 pb-5  
                    flex items-center  
                    pointer-events-none text-xl"
              >
                $
              </div>
            </div>

            <div className="flex gap-x-1">
              <label htmlFor="reservedAmount" className="mb-1">
                Reserved Supply
              </label>
              <span className="text-green mr-2">*</span>
              {errors.reservedAmount && <p className="text-red">{errors.reservedAmount.message}</p>}
            </div>

            <div className="relative">
              <input
                {...register("reservedAmount", {
                  required: "Enter reserved supply, or 0",
                })}
                id="reservedAmount"
                type="number"
                className={cn(inputStyles, "pl-[2.75rem]")}
                autoComplete="off"
              />
              <div
                className="absolute inset-y-0 left-0 pl-2 pb-5  
                    flex items-center  
                    pointer-events-none"
              >
                {chain.name === Chain.Solana && <Image src={solanaLogo} alt="solana-logo" height={28} width={28} />}
                {chain.name === Chain.Eth && <Image src={ethLogo} alt="ethereum-logo" height={28} width={28} />}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex gap-x-1">
              <label htmlFor="description" className="mb-1">
                Description
              </label>
              <span className="text-green mr-2">*</span>
              {errors.description && <p className="text-red">{errors.description.message}</p>}
            </div>
            <textarea
              {...register("description", {
                required: "Token description is required",
              })}
              id="description"
              className="h-32 w-[410px] tablet:w-[350px] laptop:w-[430px] desktop:w-[450px] mb-5 px-2 py-1 rounded-lg outline-none bg-dark-gray focus:ring-2 ring-gray"
            />

            <div className="flex gap-x-1">
              <label htmlFor="image" className="mb-1">
                Image
              </label>
              <span className="text-green mr-2">*</span>
              {errors.image && <p className="text-red">{errors.image.message}</p>}
            </div>
            <input
              {...register("image", {
                required: "Token image is required",
              })}
              id="image"
              type="file"
              accept="image/*"
              className={`${inputStyles} file:mt-1 file:bg-gray file:rounded-lg file:text-white file:border-0 file:px-2 file:py-1 file:hover:cursor-pointer file:hover:bg-gray/80`}
            />
          </div>
        </div>

        <div className="flex flex-col mt-10">
          <p className="mb-1 ml-1 tablet:ml-4 laptop:ml-5">Optional Links</p>

          <div className="flex w-[415px] tablet:w-[750px] laptop:w-[925px] desktop:w-[975px] justify-between">
            <LaunchCoinFormModal name="twitter" pattern="https://x.com/*" register={register} resetField={resetField} />
            <LaunchCoinFormModal name="telegram" register={register} resetField={resetField} />
            <LaunchCoinFormModal name="website" pattern="https://.*" register={register} resetField={resetField} />
            <LaunchCoinFormModal
              name="discord"
              pattern="https://discord.gg/*"
              register={register}
              resetField={resetField}
            />
            <LaunchCoinFormModal name="other" pattern="https://.*" register={register} resetField={resetField} />
          </div>
        </div>

        <FormSubmitButton
          isSubmitting={isSubmitting}
          pendingText="LAUNCHING..."
          className="h-10 w-[410px] laptop:w-[425px] my-20 bg-green rounded-3xl flex items-center justify-center hover:bg-light-green active:scale-[0.97] transition"
        >
          <p className="text-dark font-proximaSoftBold">HAVE SOME FUN</p>
        </FormSubmitButton>
      </form>
    </section>
  );
}
