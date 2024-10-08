import { User } from "@prisma/client";
import ProfileMenuButton from "./ProfileMenuButton";

type ProfileMenuToggleProps = {
  profileUser: User;
  currentView: string;
};

export default function ProfileMenuToggle({ profileUser, currentView }: ProfileMenuToggleProps) {
  return (
    <section className="flex gap-x-4 items-center my-6">
      <ProfileMenuButton view="Profile" profileUser={profileUser} currentView={currentView} />
      <ProfileMenuButton view="Followers" profileUser={profileUser} currentView={currentView} />
      <ProfileMenuButton view="Following" profileUser={profileUser} currentView={currentView} />
      <ProfileMenuButton
        view="Portfolio"
        profileUser={profileUser}
        currentView={currentView}
        className="hidden bg-black hover:bg-black"
      />
      <ProfileMenuButton
        view="Achievements"
        profileUser={profileUser}
        currentView={currentView}
        className="hidden bg-black hover:bg-black"
      />
    </section>
  );
}
