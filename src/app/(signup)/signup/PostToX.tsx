import Image from "next/image";

const POST_TEXT =
  "I've just signed up for @frogdotfun early access, to make memecoins fun again.\n\n#MakeMemecoinsFunAgain #FrogDotFun";

export function PostToX() {
  const post = () => {
    const url = new URL("https://x.com/intent/post");
    url.searchParams.append("text", POST_TEXT);
    window.open(url, "_blank");
  };

  return (
    <div className="w-[600px] h-[300px] bg-black p-10 flex gap-8 items-start rounded-3xl mt-12">
      <Image
        src="/Frog.fun_Default_PFP.png"
        alt="Frog Fun Logo"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex flex-col justify-between h-full">
        <p className="text-white whitespace-pre-line font-bold text-lg">
          {POST_TEXT}
        </p>
        <button
          onClick={post}
          className="uppercase bg-dark-green rounded-full ml-auto text-lg text-white font-medium px-2 py-1 mt-auto"
        >
          Post
        </button>
      </div>
    </div>
  );
}
