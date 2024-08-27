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

export default function EditProfileForm({
  profileUser,
}: HowItWorkdsModalProps) {
  const router = useRouter();
  const [userExists, setUserExists] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const { address } = useAccount();
  const { currentUser } = useUser();
  const disabled = profileUser.id !== currentUser?.id;
  const inputStyles =
    "h-10 w-[425px] bg-dark-gray mb-6 mt-1 px-2 rounded-lg outline-0 focus:ring-2 ring-gray";

  const handleSubmit = async (formData: FormData) => {
    try {
      const username = formData.get("username");

      address && (await updateUserData(formData, address));

      setTimeout(() => {
        toast.success("Profile successfully updated!");
      }, 2000);

      if (username) {
        router.push(`/profile/${username}`);
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const debounced = useDebouncedCallback(async (value) => {
    const usernameExists = await fetchUserByName(value);
    if (usernameExists) {
      setUserExists(true);
    } else if (!usernameExists && value !== "") {
      setUsernameAvailable(true);
    }
  }, 500);

  return (
    <form className="mt-4 flex flex-col" action={handleSubmit}>
      <div className="flex">
        <div className="flex flex-col mx-12">
          <div className="flex items-center gap-x-3">
            <label htmlFor="username">Username</label>
            {userExists && (
              <p className="text-red-500">Username already exists</p>
            )}
            {usernameAvailable && (
              <p className="text-green">Username available</p>
            )}
          </div>
          <input
            type="text"
            id="username"
            name="username"
            minLength={1}
            maxLength={44}
            className={cn(
              inputStyles,
              userExists && "ring-red-500",
              usernameAvailable && "ring-green"
            )}
            autoComplete="off"
            defaultValue={profileUser.name}
            onChange={async (e) => {
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
            className={`${inputStyles} file:mt-1 file:bg-gray file:rounded-lg file:text-white file:border-0 file:px-2 file:py-1 file:hover:cursor-pointer file:hover:bg-gray/80`}
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
          className={cn(
            "self-center flex justify-center items-center text-lg bg-green text-dark font-proximaSoftBold h-10 w-[425px] my-20 mr-6 rounded-3xl hover:bg-light-green active:scale-[0.98] transition",
            userExists && "hover:bg-green"
          )}
        >
          SAVE PROFILE
        </FormSubmitButton>
      )}
    </form>
  );
}
