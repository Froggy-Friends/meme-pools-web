import Header from "@/components/Header";
import CreateCoinForm from "@/components/create/CreateCoinForm";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";

export default function CreateCoin() {
  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={Chain.Eth} />

      <div className="flex justify-center items-center w-full">
        <div className="flex items-center mt-4 gap-x-4">
          <h1 className="text-[28px] tablet:text-4xl laptop:text-5xl">
            Create a coin on{" "}
            <span className="font-allumiBold text-primary">
              <span>Memepools</span>
            </span>
          </h1>
        </div>
      </div>

      <CreateCoinForm />

      <Footer />
    </main>
  );
}
