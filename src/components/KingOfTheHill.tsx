import Image from "next/image";
import placeholderLogo from "../../public/pepe-placeholder.png";

export default function KingOfTheHill() {
  return (
    <section className="mx-auto mt-10 flex flex-col items-center">
      <h3 className="text-xl pb-4">King of the Hill</h3>

      <div className="flex gap-x-3">
        <Image
          src={placeholderLogo}
          alt="Coin image"
          height={100}
          width={100}
        />

        <div className="flex flex-col">
          <p>Created by...</p>
          <p>Market cap...</p>
          <p>replies...</p>
          <p>Ticker name...</p>
        </div>
      </div>
    </section>
  );
}
