export default function TokenSwap() {
  return (
    <section className="w-[350px] bg-gray-950/90 text-white p-4 rounded-lg">
      <div className="flex gap-x-2 justify-center pb-10">
        <button className="w-[50%] p-2 rounded-lg bg-green-500">BUY</button>
        <button className="w-[50%] p-2 rounded-lg bg-red-500">SELL</button>
      </div>

      <div className="flex justify-between text-sm pb-4">
        <button className="py-1 px-2 rounded-lg bg-gray-950/80">
          switch to TRANSILLY
        </button>
        <button className="py-1 px-2 rounded-lg bg-gray-950/80">
          set max slippage
        </button>
      </div>

      <input
        type="number"
        placeholder="0"
        className="p-2 mb-4 w-full rounded-lg bg-gray-950/90 ring-white/20 ring-1"
      />

      <div className="flex gap-x-2 text-sm pb-4">
        <button className="py-1 px-2 rounded-lg bg-gray-950/80">reset</button>
        <button className="py-1 px-2 rounded-lg bg-gray-950/80">1 SOL</button>
        <button className="py-1 px-2 rounded-lg bg-gray-950/80">5 SOL</button>
        <button className="py-1 px-2 rounded-lg bg-gray-950/80">10 SOL</button>
      </div>

      <button className="w-full text-center p-2 rounded-lg bg-green-500">
        Place Trade
      </button>
    </section>
  );
}
