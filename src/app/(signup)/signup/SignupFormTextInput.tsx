import { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type SignupFormTextInputProps = {
  label: string;
} & Omit<UseFormRegisterReturn, "ref">;

const SignupFormTextInput = forwardRef<
  HTMLInputElement,
  SignupFormTextInputProps
>(({ label, name, ...rest }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={name} className="text-lg text-white">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        ref={ref}
        {...rest}
        className="w-full border-2 border-white rounded-md bg-transparent p-2 text-sm focus:ring-white focus:ring-1 focus:outline-none text-white"
      />
    </div>
  );
});

SignupFormTextInput.displayName = "SignupFormTextInput";

export default SignupFormTextInput;
