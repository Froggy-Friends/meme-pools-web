import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Cookie } from "@/models/cookie";
import { Chain } from "@/models/chain";

export default async function Home() {
  const cookieStore = cookies();
  const chain = cookieStore.get(Cookie.Chain)?.value as Chain || Chain.Base;

  redirect(`/${chain}`);
}
