import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Chain } from "@/models/chain";

export default function BaseHomePage() {
  return (
    <main className="flex flex-col min-h-[100vh] mx-32 px-4">
      <Header chain={Chain.Base} />

      <section className="flex justify-center py-32">
        <h2 className="text-5xl font-bold">
          COMING <span className="text-primary">SOON</span> TO <span className="text-based">BASE</span>
        </h2>
      </section>

      <Footer />
    </main>
  );
}
