import Header from "@/components/Header";
import LaunchCoinForm from "@/components/launch/LaunchCoinForm";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";

export default function LaunchCoin() {
  return (
    <main className="flex flex-col max-w-[1200px] min-h-[100vh] mx-auto">
      <Header chain={Chain.Base}/>
      
      <LaunchCoinForm />

      <Footer />
    </main>
  );
}
