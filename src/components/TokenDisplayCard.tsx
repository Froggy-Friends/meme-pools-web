import Image from "next/image";
import placeholderLogo from "../../public/pepe-placeholder.png";

export default function TokenDisplayCard() {
  return (
    <div className="flex gap-x-3 w-[31%] pb-10">
      <Image src={placeholderLogo} alt="token-image" height={100} width={100} />

      <div className="flex flex-col">
        <p>Created by...</p>
        <p>market cap...</p>
        <p>replies...</p>
        <p>Name (Ticker): description...</p>
      </div>
    </div>
  );
}
