"use client";

import { CircularProgress } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
  isSubmitting?: boolean;
};

export default function FormSubmitButton({
  children,
  className,
  disabled,
  isSubmitting
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={disabled}>
      {pending || isSubmitting ? (
        <CircularProgress
          classNames={{
            svg: "w-6 h-6",
            indicator: "stroke-black",
            track: "stroke-white/20",
          }}
          aria-label="Loading..."
          color="default"
          className="px-[0.125rem]"
        />
      ) : (
        children
      )}
    </button>
  );
}
