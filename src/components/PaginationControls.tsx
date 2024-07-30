import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

type PaginationControlsProps = {
  previousPath: string;
  nextPath: string;
};

export default function PaginationControls({
  previousPath,
  nextPath,
}: PaginationControlsProps) {
  const buttonStyles =
    "flex items-center gap-x-2 border border-black rounded-md p-2";

  return (
    <section className="flex gap-x-4 self-end">
      <Link href={previousPath} className={buttonStyles}>
        <FaArrowLeft size={20} /> Prev
      </Link>
      <Link href={nextPath} className={buttonStyles}>
        Next <FaArrowRight size={20} />
      </Link>
    </section>
  );
}
