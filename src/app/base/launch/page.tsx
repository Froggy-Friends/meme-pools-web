import Header from "@/components/Header";
import LaunchCoinForm from "@/components/launch/LaunchCoinForm";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";
import BackButton from "@/components/BackButton";
import rocket from "../../../../public/rocket.svg";
import Image from "next/image";

export default function LaunchCoin() {
  return (
    <main className="flex flex-col max-w-[1200px] min-h-[100vh] mx-auto">
      <Header chain={Chain.Base} />

      <div className="flex justify-between items-center w-[72.5%]">
        <BackButton />

        <div className="flex items-center mt-4 gap-x-4">
          <h1 className="text-5xl">
            Launch on{" "}
            <span className="font-proximaSoftBold">
              <span className="text-green">FROG</span>.FUN
            </span>
          </h1>
          <Image src={rocket} alt="rocket" height={50} width={50} />
        </div>
      </div>

      <LaunchCoinForm />

      <Footer />
    </main>
  );
}
