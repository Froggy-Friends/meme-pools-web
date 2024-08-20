import Header from "@/components/Header";
import LaunchCoinForm from "@/components/launch/LaunchCoinForm";
import Footer from "@/components/Footer";
import { Chains } from "@/models/chains";

export default function LaunchCoin() {
  return (
    <main className="mb-20">
      <Header chain={Chains.Base}/>

      <LaunchCoinForm />

      <Footer />
    </main>
  );
}
