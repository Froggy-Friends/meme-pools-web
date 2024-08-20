import Header from "@/components/Header";
import LaunchCoinForm from "./components/LaunchCoinForm";
import Footer from "@/components/Footer";

export default function LaunchCoin() {
  return (
    <main className="mb-20">
      <Header />

      <LaunchCoinForm />

      <Footer />
    </main>
  );
}
