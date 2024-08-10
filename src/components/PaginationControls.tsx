import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

type PaginationControlsProps = {
  next: () => void;
  back: () => void;
  page: number;
};

export default function PaginationControls({
  next,
  back,
  page,
}: PaginationControlsProps) {
  const buttonStyles =
    "flex items-center gap-x-2 border border-black rounded-md p-2";

  return (
    <section className="flex gap-x-4 self-end">
      <button onClick={back} className={buttonStyles} disabled={page === 1}>
        <FaArrowLeft size={20} /> Prev
      </button>
      <button onClick={next} className={buttonStyles}>
        Next <FaArrowRight size={20} />
      </button>
    </section>
  );
}
