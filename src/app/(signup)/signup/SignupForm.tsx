import { useForm } from "react-hook-form";
import Image from "next/image";
import { startTransition, useTransition } from "react";
import toast from "react-hot-toast";
import SignupFormTextInput from "./SignupFormTextInput";
import { createUser } from "./actions";

export type SignupFormData = {
  solanaAddress: string;
  ethereumAddress: string;
  emailAddress: string;
};

type SignupFormProps = {
  onUserRegistered: () => void;
};

export default function SignupForm({ onUserRegistered }: SignupFormProps) {
  const [isPending, startTransition] = useTransition();

  const registerUser = async (formData: SignupFormData) => {
    startTransition(async () => {
      try {
        await createUser({
          wallet: formData.solanaAddress,
          email: formData.emailAddress,
          name: formData.emailAddress,
        });
        onUserRegistered();
      } catch (error) {
        toast.error("Error registering, please try again.");
      }
    });
  };

  const form = useForm<SignupFormData>();

  return (
    <form
      className="w-1/3 flex flex-col gap-10"
      onSubmit={form.handleSubmit(registerUser)}
    >
      <h1 className="text-7xl text-white font-bold text-center">
        Early Access
      </h1>
      <SignupFormTextInput
        label="Solana Address"
        {...form.register("solanaAddress")}
      />
      <SignupFormTextInput
        label="Ethereum Address"
        {...form.register("ethereumAddress")}
      />
      <SignupFormTextInput
        label="Email Address"
        {...form.register("emailAddress")}
      />
      <button
        className="w-full rounded-full bg-white text-black py-2 font-bold uppercase disabled:opacity-50"
        disabled={isPending}
      >
        Signup
      </button>
    </form>
  );
}
