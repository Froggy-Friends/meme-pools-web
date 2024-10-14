"use client";

import { toTitleCase } from "@/lib/toTitleCase";
import { cn } from "@nextui-org/react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

type ProfileMenuButtonProps = {
  view: string;
  profileUser: User;
  currentView: string;
  className?: string;
};

export default function ProfileMenuButton({
  view,
  profileUser,
  currentView,
  className,
}: ProfileMenuButtonProps) {
  const router = useRouter();

  return (
    <button
      className={cn(
        "bg-dark-gray border-[0.25px] border-white/[5%] rounded-3xl py-1 px-4 text-lg hover:bg-gray transition",
        view === toTitleCase(currentView) && "bg-green text-dark font-proximaSoftBold hover:bg-green cursor-default",
        className
      )}
      onClick={() =>
        router.push(`/profile/${profileUser.name}?view=${view.toLowerCase()}`)
      }
      disabled={view === "Portfolio" || view === "Achievements"}
    >
      {view}
    </button>
  );
}
