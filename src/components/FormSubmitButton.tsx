"use client";

import { cn } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  className: string;
  pendingText: string;
  disabled?: boolean;
  isSubmitting?: boolean;
};

export default function FormSubmitButton({
  children,
  className,
  disabled,
  isSubmitting,
  pendingText,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  const buttonClasses = cn(`${className}, ${pending || isSubmitting ? "bg-light-gray hover:bg-light-gray" : ""}`);

  return (
    <button className={buttonClasses} disabled={disabled || pending || isSubmitting}>
      {pending || isSubmitting ? (
        <div className="flex justify-center">
          <span className="ml-2">{pendingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
