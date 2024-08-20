import TokenDisplayContainer from "./components/TokensDisplayContainer";
import { SearchParams } from "@/lib/types";
import { redirect } from "next/navigation";
import { validTokensPageFilters } from "@/config/token";
import { TokensPageFilters } from "@/models/token";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type TokensPageProps = {
  params: {
    filter: TokensPageFilters;
  };
  searchParams: SearchParams;
};

export default function TokensPage({ params, searchParams }: TokensPageProps) {
  const filter = params.filter;
  const page = searchParams.page || 1;
  const isValidFilter = validTokensPageFilters.includes(filter);

  if (!isValidFilter) {
    redirect("/");
  }

  return (
    <main className="flex flex-col px-12">
      <Header />

      <TokenDisplayContainer filter={filter} page={+page} />

      <Footer />
    </main>
  );
}
