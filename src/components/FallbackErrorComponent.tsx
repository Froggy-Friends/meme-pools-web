import { useChain } from "@/context/chain";
import Logo from "./Logo";
import { useRouter } from "next/navigation";

export default function FallbackErrorComponent() {
  const router = useRouter();
  const { chain } = useChain();

  return (
    <section className="flex flex-col items-center justify-center min-h-[100vh]">
      <Logo height={100} width={100} />
      <h1 className="my-5 text-3xl">Did you dive too deep?</h1>
      <button
        className="hover:bg-gray active:scale-95 bg-dark-gray py-2 px-4 border-[1px] border-white/20 rounded-3xl transition"
        onClick={() => router.push(`/${chain.name}`)}
      >
        Go back home
      </button>
    </section>
  );
}
