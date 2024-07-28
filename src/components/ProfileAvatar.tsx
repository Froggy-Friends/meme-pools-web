import Image from "next/image";
import { useAccount } from "wagmi";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";
import defaultPfp from "../../public/Frog.fun_Default_PFP.png";

export default function ProfileAvatar() {
  const { address } = useAccount();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { checkAndCreateUser } = useUser(address!);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`user`],
    queryFn: async () => {
      const data = await checkAndCreateUser();
      return data;
    },
    refetchOnMount: false,
  });

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
              height={55}
              width={55}
              className="rounded-full"
            />
          </button>
        </div>
      ) : isLoading ? (
        <Image
          src={defaultPfp}
          alt="default pfp"
          height={55}
          width={55}
          className="rounded-full"
        />
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
