import { useState } from "react";
import Image from "next/image";
import { Input } from "@nextui-org/react";

type TokenInputProps = {
  ticker?: string;
  tickerSrc: string;
  onChange?: (value: number | null) => void;
};

export default function TokenInput({ ticker, tickerSrc, onChange }: TokenInputProps) {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === "") {
      setValue("");
      onChange && onChange(null);
      return;
    }

    // Regex to match numbers with up to ten decimal places
    const regex = /^\d*\.?\d{0,10}$/;

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
      placeholder="0.0"
      value={value}
      onChange={handleChange}
      type="text"
      radius="full"
      startContent={
        <span className="flex items-center gap-2">
          <Image src={tickerSrc} alt="ticker" width={35} height={35} />
          <p className="uppercase">${ticker}</p>
        </span>
      }
    />
  );
}
