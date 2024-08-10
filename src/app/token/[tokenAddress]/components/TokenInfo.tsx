import Image from "next/image";
import { Token } from "../types";


type TokenInfoParams = {
  token: Token;
};

export default function TokenInfo({ token }: TokenInfoParams) {
  return (
    <section className="flex gap-x-2 mt-6">
      <Image src={token.image} alt="token-logo" height={125} width={125} />

      <div>
        <p>
          {token.name} ({token.ticker})
        </p>
        <p className="text-sm">{token.description}</p>
      </div>
    </section>
  );
}
