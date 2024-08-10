import { TokenFilter } from "@/lib/fetchTokens";
import AnimationToggle from "./AnimationToggle";
import NSFWToggle from "./NSFWToggle";

type TokenDisplayControlsProps = {
  filter: TokenFilter;
  onFilterChange: (filter: TokenFilter) => void;
};

export default function TokenDisplayControls({
  filter,
  onFilterChange,
}: TokenDisplayControlsProps) {
  return (
    <section>
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
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as TokenFilter)}
        >
          <option value="new">sort: newest</option>
          <option value="trending">sort: trending</option>
          <option value="volume">sort: volume</option>
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
