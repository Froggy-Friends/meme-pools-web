import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import HeaderSocialLinks from "./HeaderSocialLinks";
import frogFunLogo from "../../public/frog-fun-logo.svg";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";

export default function LogoPopover() {
  return (
    <Popover
      placement="bottom-start"
      classNames={{
        content: ["bg-dark-gray", "rounded-lg", "p-5"],
      }}
    >
      <PopoverTrigger className="cursor-pointer">
        <div className="flex items-center gap-x-1">
          <Image
            src={frogFunLogo}
            alt="Frog Fun Logo"
            height={75}
            width={75}
            className="hover:scale-[1.03] transition"
          />
          <IoIosArrowDown size={25} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col">
          <h2 className="text-5xl font-bold">
            <span className="text-green">FROG</span>.FUN
          </h2>

          <p className="text-lg pt-4">Privacy Policy</p>
          <p className="text-lg pt-4">Terms of Service</p>

          <HeaderSocialLinks />
        </div>
      </PopoverContent>
    </Popover>
  );
}
