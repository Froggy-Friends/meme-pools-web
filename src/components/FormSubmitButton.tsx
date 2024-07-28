"use client";

import { CircularProgress } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  className: string;
};

export default function FormSubmitButton({
  children,
  className,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button className={className}>
      {pending ? (
        <CircularProgress aria-label="Loading..." color="default" size="sm" />
      ) : (
        children
      )}
    </button>
  );
}
