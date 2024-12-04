import { cn, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { VscSettings } from "react-icons/vsc";
import { useRef } from "react";

type SlippagePopoverProps = {
  slippagePercent: number;
  setSlippagePercent: (slippagePercent: number) => void;
};

export default function SlippagePopover({ slippagePercent, setSlippagePercent }: SlippagePopoverProps) {
  const slippageOptions = [5, 10, 15];
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Popover
      placement="top-end"
      onOpenChange={open => {
        if (open) {
          requestAnimationFrame(() => {
            inputRef.current?.focus({ preventScroll: true });
          });
        }
      }}
    >
      <PopoverTrigger>
        <button className="flex justify-center items-center w-[65px] h-[35px] rounded-xl bg-dark-gray hover:bg-gray transition">
          <VscSettings size={25} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-dark-gray">
        <div className="flex flex-col gap-2 p-1">
          <div className=" flex items-center justify-between mx-1 mb-1">
            <p>Slippage</p>
            <p>{slippagePercent}%</p>
          </div>
          <div className="flex items-center gap-2">
            {slippageOptions.map(option => (
              <button
                key={option}
                onClick={() => setSlippagePercent(option)}
                className={cn(
                  `w-[60px] h-[30px] rounded-xl bg-gray hover:bg-light-gray transition`,
                  slippagePercent === option && "bg-primary hover:bg-primary text-black font-bold cursor-default"
                )}
              >
                {option}%
              </button>
            ))}
            <input
              ref={inputRef}
              type="text"
              placeholder="0.0%"
              className="w-[60px] h-[30px] rounded-xl bg-gray outline-none text-center"
              onChange={e => setSlippagePercent(Number(e.target.value))}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
