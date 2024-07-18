import Image from "next/image";
import placeholderLogo from "../../../public/pepe-placeholder.png";

export default function TokenInfo() {
  return (
    <section className="flex gap-x-2 mt-6">
      <Image src={placeholderLogo} alt="token-logo" height={125} width={125} />

      <div>
        <p>Token name (ticker:.....)</p>
        <p className="text-sm">Token description....</p>
      </div>
    </section>
  );
}
