"use client";

import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import FormSubmitButton from "../FormSubmitButton";
import { updateUserData } from "@/actions/profile/actions";
import { fetchUserByName } from "@/queries/profile/queries";
import { User } from "@prisma/client";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@nextui-org/react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

type HowItWorkdsModalProps = {
  profileUser: User;
};

export default function EditProfileForm({ profileUser }: HowItWorkdsModalProps) {
  const router = useRouter();
  const [userExists, setUserExists] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const { address } = useAccount();
  const { currentUser } = useUser();
  const disabled = profileUser.id !== currentUser?.id;
  const inputStyles =
    "h-10 w-fit min-w-[375px] max-w-[410px] tablet:min-w-[425px] tablet:w-[425px] laptop:min-w-[340px] laptop:w-[340px] desktop:min-w-[425px] desktop:w-[425px] bg-dark-gray mb-6 mt-1 px-2 rounded-lg outline-0 focus:ring-2 ring-gray";

  const handleSubmit = async (formData: FormData) => {
    try {
      const username = formData.get("username");

      address && (await updateUserData(formData, address));

      toast.success("Profile successfully updated!");

      if (username) {
        router.push(`/profile/${username}`);
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const debounced = useDebouncedCallback(async value => {
    const usernameExists = await fetchUserByName(value);
    if (usernameExists) {
      setUserExists(true);
    } else if (!usernameExists && value !== "") {
      setUsernameAvailable(true);
    }
  }, 500);

  return (
    <>
      <div className="h-[2px] mt-2 laptop:mt-4 w-full tablet:w-[430px] tablet:mx-auto laptop:mx-0 laptop:w-[720px] desktop:w-[890px] bg-dark-gray" />
      <form
        className="mt-6 mb-12 laptop:mb-24 flex flex-col items-center w-full laptop:items-start laptop:w-fit"
        action={handleSubmit}
      >
        <div className="flex flex-col laptop:flex-row laptop:gap-x-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-x-3">
              <label htmlFor="username">Username</label>
              {userExists && <p className="text-red">Username already exists</p>}
              {usernameAvailable && <p className="text-primary">Username available</p>}
            </div>
            <input
              type="text"
              id="username"
              name="username"
              minLength={1}
              maxLength={44}
              className={cn(inputStyles, userExists && "ring-red", usernameAvailable && "ring-primary")}
              autoComplete="off"
              defaultValue={profileUser.name}
              onChange={async e => {
                setUserExists(false);
                setUsernameAvailable(false);
                await debounced(e.target.value);
              }}
              disabled={disabled}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={inputStyles}
              autoComplete="off"
              defaultValue={profileUser.email || ""}
              disabled={disabled}
            />

            <label htmlFor="profile-picture">Profile Picture</label>
            <input
              type="file"
              id="profile-picture"
              name="profile-picture"
              className={`${inputStyles} ${
                disabled
                  ? "file:hover:cursor-not-allowed file:hover:bg-gray"
                  : "file:hover:cursor-pointer file:hover:bg-gray/80"
              } file:mt-1 file:bg-gray file:rounded-lg file:text-white file:border-0 file:px-2 file:py-1`}
              autoComplete="off"
              disabled={disabled}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="ethereum-address">Ethereum Address</label>
            <input
              type="text"
              id="ethereum-address"
              name="ethereum-address"
              className={inputStyles}
              pattern="^(0x)[0-9a-fA-F]{40}$"
              title="Enter a valid Ethereum address."
              autoComplete="off"
              defaultValue={profileUser.ethAddress || ""}
              disabled={disabled}
            />

            <label htmlFor="solana-address">Solana Address</label>
            <input
              type="text"
              id="solana-address"
              name="solana-address"
              className={inputStyles}
              autoComplete="off"
              defaultValue={profileUser.solAddress || ""}
              disabled={disabled}
            />
          </div>
        </div>

        {!disabled && (
          <FormSubmitButton
            disabled={userExists}
            pendingText="SAVING..."
            className={cn(
              "self-center flex justify-center items-center text-lg bg-primary text-dark font-proximaSoftBold h-10 min-w-[375px] max-w-[410px] laptop:min-w-[425px] laptop:w-[425px] my-12 laptop:mt-20 laptop:mb-24 laptop:mr-6 rounded-xl hover:bg-light-primary active:scale-[0.98] transition",
              userExists && "hover:bg-primary"
            )}
          >
            SAVE PROFILE
          </FormSubmitButton>
        )}
      </form>
    </>
  );
}
