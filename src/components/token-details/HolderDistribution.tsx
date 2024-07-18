import Holder from "./Holder";

export default function HolderDistribution() {
  return (
    <section className="flex flex-col mt-6">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Holder Distribution</p>
        <button className="py-1 px-2 rounded-lg bg-gray-950/90 text-sm text-white">
          Generate bubble map
        </button>
      </div>

      <Holder />
      <Holder />
      <Holder />
      <Holder />
      <Holder />
      <Holder />
      <Holder />
      <Holder />
      <Holder />
    </section>
  );
}
