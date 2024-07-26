"use client";

import Image from "next/image";
import { fetchUserAvatar } from "@/lib/actions";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@nextui-org/react";

export default function ProfileAvatar() {
  const { address, isConnected } = useAccount();
  const [avatarUrl, setAvatarUrl] = useState<string | null>("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const setAvatar = useCallback(async () => {
    const user = await fetchUserAvatar(address!);
    if (user) {
      setAvatarUrl(user.imageUrl);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      setAvatar();
    }
  }, [address, isConnected, setAvatar]);

  return (
    <>
      {avatarUrl ? (
        <div>
          <button
            onClick={() => {
              onOpen();
            }}
          >
            <Image
              src={avatarUrl}
              alt="profile-avatar"
              height={70}
              width={70}
              className="rounded-full"
            />
          </button>
        </div>
      ) : (
        <div />
      )}

      <ProfileModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        setAvatar={setAvatar}
      />
    </>
  );
}
