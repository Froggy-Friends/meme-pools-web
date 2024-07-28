import Image from "next/image";
import { useAccount } from "wagmi";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";
import { useEffect } from "react";

export default function ProfileAvatar() {
  const { address } = useAccount();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { checkAndCreateUser, } = useUser(address!);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`user`],
    queryFn: async () => {
      const data = await checkAndCreateUser();
      return data
    },
    refetchOnMount: false,
  });

  useEffect(() => {
    console.log('image', data?.imageUrl)
  }, [data])
  return (
    <>
      {data?.imageUrl ? (
        <div>
          <button
            onClick={() => {
              onOpen();
            }}
          >
            <Image
              src={data.imageUrl}
              alt="profile-avatar"
              height={70}
              width={70}
              className="rounded-full"
            />
          </button>
        </div>
      ) : isLoading ? (
        <div className="h-[60px] w-[60px] bg-gray-400 animate-pulse rounded-full" />
      ) : (
        <div />
      )}

      <ProfileModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        refetch={refetch}
      />
    </>
  );
}
