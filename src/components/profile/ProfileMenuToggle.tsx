import { User } from "@prisma/client";
import ProfileMenuButton from "./ProfileMenuButton";

type ProfileMenuToggleProps = {
  profileUser: User;
}

export default function ProfileMenuToggle({ profileUser }: ProfileMenuToggleProps) {
  return (
    <section className="flex gap-x-3 items-center my-6">
      <ProfileMenuButton view="Followers" profileUser={profileUser}/>
      <ProfileMenuButton view="Following" profileUser={profileUser}/>
    </section>
  )
}
