import { searchTokens } from "@/queries/token/queries";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SearchTokenDisplay from "./SearchTokenDisplay";
import SearchSkeleton from "./SearchSkeleton";
import { TokenSearchResult } from "@/types/token/types";
import { useDebouncedCallback } from "use-debounce";
import { useChain } from "@/context/chain";

type TokenSearchModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
};

type SortField = "date" | "time" | "mc";
type SortDirection = "asc" | "desc";

export default function TokenSearchModal({ isOpen, onOpenChange, onClose }: TokenSearchModalProps) {
  const [tokens, setTokens] = useState<TokenSearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { chain } = useChain();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedTokens = tokens
    ? [...tokens].sort((a, b) => {
        if (!sortField) return 0;

        const modifier = sortDirection === "asc" ? 1 : -1;
        switch (sortField) {
          case "date":
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * modifier;
          case "time":
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * modifier;
          case "mc":
            return (a.marketCap - b.marketCap) * modifier;
          default:
            return 0;
        }
      })
    : null;

  const debounced = useDebouncedCallback(async value => {
    if (value === "") {
      setTokens(null);
      setNoResults(false);
      return;
    }

    setIsLoading(true);
    setNoResults(false);

    const tokens = await searchTokens(value, chain.name);
    setTokens(tokens);
    if (tokens.length === 0) setNoResults(true);

    setIsLoading(false);
  }, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounced(e.target.value);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setTokens(null);
          setNoResults(false);
          setSortField(null);
          setSortDirection("desc");
        }}
        size="2xl"
        className="bg-dark max-h-[500px] min-h-[175px] overflow-y-auto mt-12"
        placement="top"
        classNames={{
          body: ["p-2 tablet:p-6"],
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader></ModalHeader>
              <ModalBody className="flex flex-col">
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="What's the ticker?"
                    autoComplete="off"
                    autoFocus
                    onChange={e => {
                      handleSearch(e);
                    }}
                    className="h-10 w-full px-12 rounded-lg bg-dark-gray border-[0.25px] border-white/[5%] outline-none focus:ring-1 ring-white"
                  />
                  <div
                    className="absolute inset-y-0 left-0 pl-4  
                    flex items-center  
                    pointer-events-none"
                  >
                    <FaMagnifyingGlass size={20} />
                  </div>
                </div>

                <div className="flex justify-between items-center h-12 px-2">
                  <p>Token</p>

                  <div className="flex max-w-[65%] tablet:w-1/2 justify-between">
                    <button
                      onClick={() => handleSort("date")}
                      className={`w-24 text-right hover:text-primary transition ${
                        sortField === "date" ? "text-primary" : ""
                      }`}
                    >
                      Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                      onClick={() => handleSort("time")}
                      className={`w-24 text-right hover:text-primary transition ${
                        sortField === "time" ? "text-primary" : ""
                      }`}
                    >
                      Time {sortField === "time" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                      onClick={() => handleSort("mc")}
                      className={`w-16 text-right hover:text-primary transition ${
                        sortField === "mc" ? "text-primary" : ""
                      }`}
                    >
                      MC {sortField === "mc" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                  </div>
                </div>

                {!isLoading && sortedTokens && (
                  <div className="mb-2">
                    {sortedTokens.map(token => {
                      return <SearchTokenDisplay key={token.id} token={token} onClose={onClose} />;
                    })}
                  </div>
                )}

                {noResults && !isLoading && (
                  <p className="mb-2 ml-2 -mt-5">No search results match, try another search</p>
                )}

                {isLoading && <SearchSkeleton />}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
