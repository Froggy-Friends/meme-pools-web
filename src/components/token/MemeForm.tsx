"use client";

import { addMeme } from "@/actions/token/actions";
import useUser from "@/hooks/useUser";
import { useRef } from "react";
import FormSubmitButton from "../FormSubmitButton";
import { cn } from "@nextui-org/react";
import { formatTicker } from "@/lib/formatTicker";
import useTokenBalance from "@/hooks/useTokenBalance";
import { Address } from "viem";
import { wagmiChains } from "@/config/reown";

type MemeFormProps = {
  tokenId: string;
  tokenAddress: string;
  tokenTicker: string;
};

export default function MemeForm({ tokenId, tokenAddress, tokenTicker }: MemeFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { currentUser } = useUser();
  const { tokenBalance } = useTokenBalance(tokenAddress as Address, wagmiChains.eth.id);

  return (
    <form
      action={async formData => {
        await addMeme(tokenId, currentUser?.id, formData);
        formRef.current?.reset();
      }}
      className="w-full desktop:w-[780px] flex flex-col mb-12 laptop:mb-24 p-3 laptop:p-6 bg-dark-gray rounded-xl"
      ref={formRef}
      id="post-meme"
    >
      <textarea
        placeholder={!tokenBalance ? `Buy $${formatTicker(tokenTicker)} to post a meme...` : "Post a meme..."}
        className="w-full desktop:w-[725px] h-[200px] bg-dark rounded-xl p-4 outline-none focus:ring-2 ring-gray"
        name="caption"
        id="caption"
      />
      <div className="flex flex-col tablet:flex-row tablet:justify-between items-start tablet:items-center mt-4 gap-y-4 tablet:gap-x-4">
        <input
          disabled={!currentUser || !tokenBalance}
          type="file"
          name="image"
          id="image"
          className="w-full tablet:w-auto file:rounded-3xl file:border-none file:bg-gray file:text-white file:px-4 file:py-2 file:cursor-pointer file:active:scale-[0.97] file:hover:bg-light-gray file:disabled:bg-gray file:disabled:cursor-default file:transition"
        />
        <FormSubmitButton
          pendingText="POSTING..."
          disabled={!currentUser || !tokenBalance}
          className={cn(
            "w-full tablet:w-28 bg-primary h-10 rounded-xl py-1 px-8 text-dark font-proximaNovaBold active:scale-[0.97] disabled:bg-gray disabled:text-white/90 hover:bg-light-primary transition-all",
            {
              "hover:bg-gray": !currentUser || !tokenBalance,
            }
          )}
        >
          <p>POST</p>
        </FormSubmitButton>
      </div>
    </form>
  );
}
