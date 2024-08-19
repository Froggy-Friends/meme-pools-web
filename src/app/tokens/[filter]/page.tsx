import { SearchParams } from "@/lib/types";
import TokenDisplayContainer from "./components/TokensDisplayContainer";

type TokensPageProps = {
    params: {
        filter: string;
    }
    searchParams: SearchParams;
}

export default function TokensPage({ params, searchParams }: TokensPageProps) {
  const filter = params.filter;
  const page = searchParams.page || 1;

  return (
    <main className="flex flex-col px-12">
        <TokenDisplayContainer filter={filter} page={+page} />
    </main>
  )
}
