import ProfileMenuButton from "./ProfileMenuButton";

type ProfileMenuToggleProps = {
  profileAddress: string;
}

export default function ProfileMenuToggle({ profileAddress }: ProfileMenuToggleProps) {
  return (
    <section className="flex gap-x-3 items-center my-6">
      <ProfileMenuButton name="Followers" profileAddress={profileAddress}/>
      <ProfileMenuButton name="Following" profileAddress={profileAddress}/>
    </section>
  )
}
