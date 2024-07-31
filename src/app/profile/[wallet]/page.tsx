import UserInfo from "@/components/profile/UserInfo";
import { fetchUser } from "@/lib/actions"

type ProfilePageProps = {
    params: {
        wallet: `0x${string}`
    }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await fetchUser(params.wallet);
    
  return (
    <main className="flex flex-col items-center px-12 mb-20">
        <UserInfo user={user!}/>
    </main>
  )
}
