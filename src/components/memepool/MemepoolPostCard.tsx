"use client";

import { useState } from "react";
import { defaultProfileAvatarUrl } from "@/config/user";
import { getTimeDifference } from "@/lib/getTimeDifference";
import { Post, User, Meme } from "@prisma/client";
import Image from "next/image";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { useSwipeable } from "react-swipeable";

type MemepoolPostCardProps = {
  post: Post & {
    user: User;
    memes: Meme[];
  };
};

export default function MemepoolPostCard({ post }: MemepoolPostCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  const nextImage = () => {
    setActiveIndex(prev => (prev + 1) % post.memes.length);
  };

  const prevImage = () => {
    setActiveIndex(prev => (prev - 1 + post.memes.length) % post.memes.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    onSwiping: ({ deltaX }) => {
      const maxDrag = 100;
      setOffsetX(Math.max(Math.min(deltaX, maxDrag), -maxDrag));
    },
    onSwiped: () => {
      setOffsetX(0);
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  if (!post?.memes?.length) {
    return null;
  }

  return (
    <div className="flex flex-col w-full p-4 tablet:p-5 bg-dark-gray rounded-xl">
      <div className="flex items-center gap-x-2">
        <Image
          src={post.user.imageUrl || defaultProfileAvatarUrl}
          alt={post.user.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col tablet:flex-row tablet:items-center gap-x-2">
          <p className="text-sm tablet:text-base">{getUserDisplayName(post.user.name)}</p>
          <p className="text-gray text-xs tablet:text-sm -mt-0.5 tablet:-mt-0">{getTimeDifference(post.createdAt)}</p>
        </div>
      </div>

      <div {...handlers} className="relative flex justify-center items-center mt-4 overflow-hidden">
        <Image
          src={post.memes[activeIndex].imageUrl}
          alt={post.memes[activeIndex].id}
          width={260}
          height={260}
          className="rounded-xl object-cover w-full h-[160px] tablet:h-[240px] laptop:h-[230px] transition-transform duration-200"
          style={{ transform: `translateX(${offsetX}px)` }}
        />

        {post.memes.length > 1 && (
          <div className="absolute bottom-2 flex gap-1">
            {post.memes.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-primary" : "bg-white"}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
