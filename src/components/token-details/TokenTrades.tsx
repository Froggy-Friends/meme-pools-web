import TokenTrade from "./TokenTrade";

export default function TokenTrades() {
  return (
    <section className="flex flex-col mt-4">
      <div className="flex w-full justify-between pb-4 mb-1 rounded-lg bg-gray-950/95 p-2 text-white">
        <p>Account</p>
        <p>Type</p>
        <p>SOL</p>
        <p>TRANSILLY</p>
        <p>Date</p>
        <p>Transaction</p>
      </div>

      <TokenTrade />
      <TokenTrade />
      <TokenTrade />
      <TokenTrade />
      <TokenTrade />
      <TokenTrade />
      <TokenTrade />
      <TokenTrade />
    </section>
  );
}
