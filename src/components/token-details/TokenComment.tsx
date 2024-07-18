import Image from "next/image";
import placeholderImage from "../../../public/pepe-placeholder.png";

export default function TokenComment() {
  return (
    <div className="flex flex-col pb-4 mb-1 w-full rounded-lg bg-gray-950/95 p-2 text-white">
      <div className="flex gap-x-3">
        <Image
          src={placeholderImage}
          alt="user-profile-picture"
          height={25}
          width={25}
        />
        <p>USERNAME...</p>
        <p>Time...</p>
        <p>Likes...</p>
        <p>Reply...</p>
      </div>

      <p>Comment...</p>
    </div>
  );
}
