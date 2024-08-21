import Header from "@/components/Header";
import LaunchCoinForm from "@/components/launch/LaunchCoinForm";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";

export default function LaunchCoin() {
  return (
    <main className="mb-20">
      <Header chain={Chain.Base}/>

      <LaunchCoinForm />

      <Footer />
    </main>
  );
}
