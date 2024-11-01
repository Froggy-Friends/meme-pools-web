import { User } from "@prisma/client";
import ProfileMenuButton from "./ProfileMenuButton";

type ProfileMenuToggleProps = {
  profileUser: User;
  cachedUser: User | null | undefined;
  currentView: string;
};

export default function ProfileMenuToggle({ profileUser, cachedUser, currentView }: ProfileMenuToggleProps) {
  return (
    <div className="overflow-x-auto">
      <section className="flex gap-x-4 items-center my-6 min-w-max">
        {cachedUser?.id === profileUser.id && (
          <ProfileMenuButton view="Settings" profileUser={profileUser} currentView={currentView} />
        )}
        <ProfileMenuButton view="Created" profileUser={profileUser} currentView={currentView} />
        <ProfileMenuButton view="Followers" profileUser={profileUser} currentView={currentView} />
        <ProfileMenuButton view="Following" profileUser={profileUser} currentView={currentView} />
      </section>
    </div>
  );
}
