import { SearchParams } from "@/lib/types";
import { redirect } from "next/navigation";
import { validTokenFilter } from "@/config/base/token";
import { TokenFilter } from "@/models/token";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TokensDisplayContainer from "@/components/tokens/TokensDisplayContainer";
import { Chain } from "@/models/chain";

type TokensPageProps = {
  params: {
    filter: TokenFilter;
  };
  searchParams: SearchParams;
};

export default function TokensPage({ params, searchParams }: TokensPageProps) {
  const filter = params.filter;
  const page = searchParams.page || 1;
  const isValidFilter = validTokenFilter.includes(filter);

  if (!isValidFilter) {
    redirect("/");
  }

  return (
    <main className="flex flex-col max-w-[1200px] min-h-[100vh] px-4 mx-auto">
      <Header chain={Chain.Base} />

      <TokensDisplayContainer filter={filter} pageFilter={+page} />

      <Footer />
    </main>
  );
}
