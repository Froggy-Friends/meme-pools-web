import { useState } from "react";
import Image from "next/image";
import { Input } from "@nextui-org/react";
import { ethLogo } from "@/config/chains";

type TokenInputProps = {
  ticker?: string;
  placeholder?: string;
  onChange?: (value: number | null) => void;
};

export default function TokenInput({ ticker, placeholder, onChange }: TokenInputProps) {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === "") {
      setValue("");
      onChange && onChange(null);
      return;
    }

    // Regex to match numbers with up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(inputValue)) {
      setValue(inputValue);
      onChange && onChange(parseFloat(inputValue));
    }
  };

  return (
    <Input
      classNames={{
        input: "ml-8 appearance-none",
        inputWrapper: ["h-[55px] bg-dark data-[hover=true]:bg-dark data-[focus=true]:bg-dark"],
      }}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      type="text"
      radius="full"
      startContent={
        <span className="flex items-center gap-2">
          <Image src={ethLogo} alt="Eth" width={35} height={35} />
          <p className="uppercase">${ticker}</p>
        </span>
      }
    />
  );
}
