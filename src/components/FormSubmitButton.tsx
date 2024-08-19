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
        <CircularProgress classNames={{svg: "w-6 h-6"}} aria-label="Loading..." color="default" className="px-[0.125rem]"/>
      ) : (
        children
      )}
    </button>
  );
}
