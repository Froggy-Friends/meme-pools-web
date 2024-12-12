import { getPosts } from "@/queries/memepool/queries";
import MemepoolPostCard from "./MemepoolPostCard";

type PostContainerProps = {
  tokenId: string;
};

export default async function PostContainer({ tokenId }: PostContainerProps) {
  const posts = await getPosts(tokenId);

  return (
    <section className="mt-20 tablet:mt-32 mb-20 grid grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4">
        {posts.map((post) => (
        <MemepoolPostCard key={post.id} post={post} />
      ))}
    </section>
  );
}
