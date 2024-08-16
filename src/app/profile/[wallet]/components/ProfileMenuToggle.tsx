import ProfileMenuButton from "./ProfileMenuButton";

export default function ProfileMenuToggle() {
  return (
    <section className="flex gap-x-3 items-center mt-6">
      <ProfileMenuButton name="Followers" />
      <ProfileMenuButton name="Following" />
    </section>
  )
}
