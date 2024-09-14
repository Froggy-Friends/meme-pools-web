import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

type TokenReverseButtonProps = {
  reverse: boolean;
  toggleReverse: () => void;
};

export default function TokenReverseButton({
  reverse,
  toggleReverse,
}: TokenReverseButtonProps) {
  return (
    <button
      className="px-3 h-8 bg-dark-gray border border-gray rounded-[4px] flex items-center justify-center"
      onClick={toggleReverse}
    >
      {reverse ? <FaChevronDown size={16} /> : <FaChevronUp size={16} />}
    </button>
  );
}
