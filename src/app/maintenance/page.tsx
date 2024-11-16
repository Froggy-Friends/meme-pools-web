import Logo from "@/components/Logo";

export default function Maintenance() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[100vh]">
      <Logo height={100} width={100} />
      <h1 className="my-5 text-3xl">Beta testing is closed.</h1>
      <p className="text-center">Launch date coming soon!</p>
    </main>
  );
}
