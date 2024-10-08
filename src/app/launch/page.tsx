import Header from "@/components/Header";
import LaunchCoinForm from "@/components/launch/LaunchCoinForm";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";
import Image from "next/image";

export default function LaunchCoin() {
  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={Chain.Eth} />

      <div className="flex justify-center items-center w-full">
        <div className="flex items-center mt-4 gap-x-4">
          <h1 className="text-3xl tablet:text-4xl laptop:text-5xl">
            Launch on{" "}
            <span className="font-proximaSoftBold">
              <span className="text-green">FROG</span>.FUN
            </span>
          </h1>
        </div>
      </div>

      <LaunchCoinForm />

      <Footer />
    </main>
  );
}
