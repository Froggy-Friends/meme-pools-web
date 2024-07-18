export default function TokenSearch() {
  return (
    <section className="mt-12 mx-auto flex items-center gap-x-4">
      <input
        type="text"
        placeholder="Search for token"
        className="w-[20rem] h-10 rounded-lg ring-1 ring-black px-2"
      />
      <button className="border-[1px] border-black rounded-lg p-2">
        Search
      </button>
    </section>
  );
}
