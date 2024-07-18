import AnimationToggle from "./AnimationToggle";
import NSFWToggle from "./NSFWToggle";

export default function TokenDisplayControls() {
  return (
    <section className="mt-12">
      <div className="flex gap-x-3 pb-4">
        <button>Following</button>
        <button>Terminal</button>
        <button>For You</button>
      </div>

      <div className="flex gap-x-2">
        <select
          id="sort-tokens"
          name="sort-tokens"
          className="border-[1px] border-black rounded-lg p-2"
        >
          <option value="bump-order">sort: bump order</option>
          <option value="last-reply">sort: last reply</option>
          <option value="reply-count">sort: reply count</option>
          <option value="market-cap">sort: market cap</option>
          <option value="creation-time">sort: creation time</option>
          <option value="currently-live">sort: currently live</option>
        </select>

        <select
          id="sort-token-order"
          name="sort-token-order"
          className="border-[1px] border-black rounded-lg p-2"
        >
          <option value="descending">order: desc</option>
          <option value="ascending">order: asc</option>
        </select>

        <div className="flex flex-col">
          <AnimationToggle />
          <NSFWToggle />
        </div>
      </div>
    </section>
  );
}
