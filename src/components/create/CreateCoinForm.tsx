"use client";

import useCreateToken from "@/hooks/useCreateToken";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import { parseUnits } from "viem";
import { createCoin, uploadImage } from "@/actions/create/actions";
import FormSubmitButton from "../FormSubmitButton";
import CreateCoinFormModal from "./CreateCoinFormModal";
import { useForm } from "react-hook-form";
import { createFormData } from "@/lib/createFormData";
import { useChain } from "@/context/chain";
import Image from "next/image";
import { cn, Switch } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { GrRefresh } from "react-icons/gr";
import { useCallback, useRef, useState } from "react";
import { maxReservedSupply } from "@/lib/constants";
import { PutBlobResult } from "@vercel/blob";
import { useDebouncedCallback } from "use-debounce";
import useReservePrice from "@/hooks/useReservePrice";
import { MdInfoOutline } from "react-icons/md";
import { Tooltip, useDisclosure } from "@nextui-org/react";
import { formatNumber } from "@/lib/formatNumber";
import usePostTradeData from "@/hooks/usePostTradeData";
import getEthPrice from "@/lib/getEthPrice";
import CreateCoinPendingModal from "./CreateCoinPendingModal";
import * as Sentry from "@sentry/nextjs";

export type CreateFormValues = {
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

export default function CreateCoinForm() {
  const { address, isConnected } = useAccount();
  const { createToken, txStatus, txHash } = useCreateToken();
  const { chain } = useChain();
  const { getReservePrice } = useReservePrice();
  const { postReserveData } = usePostTradeData();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const formRef = useRef<HTMLFormElement>(null);
  const [tokenImageBlob, setTokenImageBlob] = useState<PutBlobResult | null>(null);
  const [reserveCost, setReserveCost] = useState<string | null>(null);
  const [formattedReservedAmount, setFormattedReservedAmount] = useState("");
  const [isNsfw, setIsNsfw] = useState(false);
  const [ticker, setTicker] = useState("");
  const [autoLaunch, setAutoLaunch] = useState(true);

  const {
    register,
    handleSubmit,
    resetField,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateFormValues>();
  const inputStyles =
    "h-10 w-[calc(100vw-1rem)] max-w-[410px] tablet:w-[350px] laptop:w-[420px] laptop:max-w-[420px] desktop:max-w-[450px] desktop:w-[450px] px-4 mb-5 rounded-lg outline-none bg-dark-gray focus:ring-2 ring-gray";

  const onSubmit = handleSubmit(async (data: CreateFormValues) => {
    const formData = createFormData(data);
    const numericReservedAmount = data.reservedAmount.replace(/,/g, "");
    const reservedAmount = parseUnits(numericReservedAmount, 18) || BigInt(0);

    try {
      setTicker("");

      if (!address || !isConnected) {
        throw new Error("Wallet not connected");
      }

      setTicker(data.ticker);
      onOpen();

      const tokenDetails = await createToken({
        reservedAmount: reservedAmount,
        name: data.name,
        symbol: data.ticker,
        autoLaunch: autoLaunch,
      });

      if (!tokenDetails) {
        onClose();
        return;
      }

      const errorMessage = await createCoin(
        formData,
        address,
        tokenDetails.tokenAddress,
        tokenDetails.creator,
        chain.name,
        tokenImageBlob,
        isNsfw
      );

      if (reservedAmount !== BigInt(0)) {
        const { reservePrice, totalCost } = await getReservePrice(Number(numericReservedAmount));
        const ethPrice = await getEthPrice();

        await postReserveData(
          tokenDetails.tokenAddress,
          tokenDetails.creator,
          Number(totalCost),
          Number(reservePrice),
          Number(reservedAmount),
          ethPrice,
          tokenDetails.txHash
        );
      }

      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        toast.success("Coin created!");
      }

      onClose();
      setTicker("");
      reset();
      router.push(`/${chain.name}/token/${tokenDetails.tokenAddress}`);
    } catch (error) {
      Sentry.captureException(error);
      toast.error((error as Error).message);
      onClose();
      setTicker("");
    }
  });

  const handleReservedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^\d.]/g, "");
    const formatted = formatNumber(numericValue);

    if (parseFloat(numericValue) <= maxReservedSupply) {
      setFormattedReservedAmount(formatted);
      numericValue ? debouncedReservePrice(numericValue) : setReserveCost(null);
    }
  };

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const blob = await uploadImage(formData);
        setTokenImageBlob(blob);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }, []);

  const debouncedReservePrice = useDebouncedCallback(async value => {
    if (!value) {
      setReserveCost(null);
      return;
    }

    const { totalCost } = await getReservePrice(value);
    setReserveCost(totalCost);
  }, 700);

  return (
    <section className="mt-20">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center max-w-[925px] mx-auto px-4 tablet:px-0"
        ref={formRef}
      >
        <div className="flex self-end items-center gap-x-2 tablet:gap-x-4 -mr-3 tablet:-mr-0 desktop:-mr-2">
          <div className="flex items-center gap-x-2 tablet:gap-x-4 mb-[15px]">
            <Switch
              isSelected={autoLaunch}
              onValueChange={setAutoLaunch}
              color="primary"
              size="sm"
              classNames={{
                thumb: "bg-dark",
                base: cn("inline-flex flex-row-reverse", "justify-between cursor-pointer gap-2"),
                wrapper: "hover:bg-light-gray",
              }}
            >
              {" "}
              <div className="flex gap-x-1 items-center">
                <Tooltip
                  placement="top"
                  content="Meme Pools will auto-deploy your coin LP at 100% launch progress. Toggle off for manual deployment on your profile page."
                  className="max-w-[200px] tablet:max-w-[300px]"
                >
                  <button>
                    <MdInfoOutline size={21} className="text-light-gray" />
                  </button>
                </Tooltip>
                <p className="text-[15px] tablet:text-lg">Auto Launch</p>
              </div>
            </Switch>
            <Switch
              isSelected={isNsfw}
              onValueChange={setIsNsfw}
              color="primary"
              size="sm"
              classNames={{
                thumb: "bg-dark",
                base: cn("inline-flex flex-row-reverse", "justify-between cursor-pointer gap-2"),
                wrapper: "hover:bg-light-gray",
              }}
            >
              <p className="text-[15px] tablet:text-lg">NSFW</p>
            </Switch>
          </div>
          <button
            onClick={() => formRef.current?.reset()}
            className="flex items-center gap-x-2 bg-dark-gray rounded-xl mb-4 px-[0.6rem] tablet:px-4 py-2 hover:bg-gray active:scale-[0.97] transition"
          >
            <p className="text-[15px] tablet:text-base">Reset</p>
            <GrRefresh className="h-4 w-4 tablet:h-5 tablet:w-5" />
          </button>
        </div>

        <div className="flex flex-col tablet:flex-row tablet:gap-x-4 laptop:gap-x-10">
          <div className="flex flex-col">
            <div className="flex gap-x-1">
              <label htmlFor="name" className="mb-1">
                Name
              </label>
              <span className="text-primary mr-2">*</span>
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
              <span className="text-primary mr-2">*</span>
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
              <label htmlFor="image" className="mb-1">
                Image
              </label>
              <span className="text-primary mr-2">*</span>
              {errors.image && <p className="text-red">{errors.image.message}</p>}
            </div>
            <input
              {...register("image", {
                required: "Token image is required",
              })}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`${inputStyles} file:mt-1 file:bg-gray file:rounded-lg file:text-white file:border-0 file:px-2 file:py-1 file:hover:cursor-pointer file:hover:bg-gray/80 file:active:scale-[0.97] transition`}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex gap-x-1">
              <label htmlFor="description" className="mb-1">
                Description
              </label>
              <span className="text-primary mr-2">*</span>
              {errors.description && <p className="text-red">{errors.description.message}</p>}
            </div>
            <textarea
              {...register("description", {
                required: "Token description is required",
              })}
              id="description"
              className="h-32 w-[calc(100vw-1rem)] max-w-[410px] tablet:w-[350px] laptop:w-[420px] laptop:max-w-[420px] desktop:max-w-[450px] desktop:w-[450px] px-4 py-2 mb-5 rounded-lg outline-none bg-dark-gray focus:ring-2 ring-gray"
            />

            <div className="flex gap-x-1 items-center">
              <label htmlFor="reservedAmount" className="mb-1">
                Reserved Supply
              </label>
              <Tooltip placement="right" content="Max 10 million tokens can be reserved" className="mb-2">
                <button>
                  <MdInfoOutline size={21} className="text-light-gray mb-[0.125rem]" />
                </button>
              </Tooltip>
              {errors.reservedAmount && <p className="text-red">{errors.reservedAmount.message}</p>}
            </div>

            <div className="relative">
              <input
                {...register("reservedAmount", {
                  validate: value => {
                    if (!value.trim()) return true;
                    const numericValue = parseFloat(value.replace(/,/g, ""));
                    return numericValue <= maxReservedSupply || `Must be ${maxReservedSupply.toLocaleString()} or less`;
                  },
                })}
                id="reservedAmount"
                type="text"
                placeholder="0.0"
                className={cn(inputStyles, "pl-[2.75rem]")}
                autoComplete="off"
                value={formattedReservedAmount}
                onChange={handleReservedAmountChange}
              />
              <div
                className="absolute inset-y-0 left-0 pl-2 pb-5  
                    flex items-center  
                    pointer-events-none"
              >
                {!tokenImageBlob && <div className="w-7 h-7 rounded-full bg-dark"></div>}
                {tokenImageBlob && (
                  <Image
                    src={tokenImageBlob.url}
                    alt="token image"
                    width={28}
                    height={28}
                    className="rounded-full h-7 w-7 object-cover"
                  />
                )}
              </div>
              <div
                className="absolute inset-y-0 right-0 pr-8 pb-5  
                flex items-center  
                pointer-events-none"
              >
                {reserveCost && <p className="text-light-gray">{parseFloat(reserveCost).toFixed(6)} ETH</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10">
          <p className="mb-1">Optional Links</p>

          <div className="flex w-[calc(100vw-1rem)] max-w-[415px] tablet:min-w-[720px] tablet:w-[720px] laptop:min-w-[875px] laptop:w-[875px] desktop:min-w-[950px] desktop:w-[950px] justify-between">
            <CreateCoinFormModal
              name="twitter"
              pattern="https://x.com/*"
              register={register}
              resetField={resetField}
              watch={watch}
            />
            <CreateCoinFormModal name="telegram" register={register} resetField={resetField} watch={watch} />
            <CreateCoinFormModal
              name="website"
              pattern="https://.*"
              register={register}
              resetField={resetField}
              watch={watch}
            />
            <CreateCoinFormModal
              name="discord"
              pattern="https://discord.gg/*"
              register={register}
              resetField={resetField}
              watch={watch}
            />
            <CreateCoinFormModal
              name="other"
              pattern="https://.*"
              register={register}
              resetField={resetField}
              watch={watch}
            />
          </div>
        </div>

        <FormSubmitButton
          isSubmitting={isSubmitting}
          pendingText="CREATING COIN..."
          className="h-10 w-[calc(100vw-1rem)] max-w-[410px] laptop:min-w-[425px] laptop:w-[425px] my-20 bg-primary rounded-xl flex items-center justify-center hover:bg-light-primary active:scale-[0.97] transition"
        >
          <p className="text-black font-proximaNovaBold">CREATE COIN</p>
        </FormSubmitButton>
      </form>

      <CreateCoinPendingModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        txStatus={txStatus}
        txHash={txHash}
        ticker={ticker}
        tokenImage={tokenImageBlob?.url || null}
      />
    </section>
  );
}
