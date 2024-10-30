import { searchTokens, searchTokensByCa } from "@/queries/token/queries";
import { Modal, ModalContent, ModalHeader, ModalBody, Switch } from "@nextui-org/react";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SearchTokenDisplay from "./SearchTokenDisplay";
import SearchSkeleton from "./SearchSkeleton";
import { TokenSearchResult } from "@/types/token/types";
import { useDebouncedCallback } from "use-debounce";

type TokenSearchModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
};

export default function TokenSearchModal({ isOpen, onOpenChange, onClose }: TokenSearchModalProps) {
  const [tokens, setTokens] = useState<TokenSearchResult[] | null>(null);
  const [token, setToken] = useState<TokenSearchResult | null>(null);
  const [caSearch, setCaSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const debounced = useDebouncedCallback(async value => {
    if (value === "") {
      setTokens(null);
      setToken(null);
      setNoResults(false);
      return;
    }

    setIsLoading(true);
    setNoResults(false);
    if (!caSearch) {
      const tokens = await searchTokens(value);
      setTokens(tokens);
      if (tokens.length === 0) setNoResults(true);
    } else {
      const token = await searchTokensByCa(value);
      setToken(token);
      if (!token) setNoResults(true);
    }
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
          setToken(null);
          setTokens(null);
          setNoResults(false);
          setCaSearch(true);
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
                    placeholder={caSearch ? "What's the CA?" : "What's the ticker?"}
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
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <Switch
                      size="sm"
                      isSelected={caSearch}
                      color="primary"
                      onValueChange={() => setCaSearch(!caSearch)}
                      classNames={{
                        wrapper: ["bg-white/50"],
                      }}
                    ></Switch>
                    <p>CA</p>
                  </div>
                </div>

                <div className="flex justify-between items-center h-12 px-2">
                  <p>Token</p>

                  <div className="flex w-[55%] tablet:w-1/2 justify-between">
                    <p className="w-20 text-right">Date</p>
                    <p className="w-24 text-right">Time</p>
                    <p className="w-16 text-right">MC</p>
                  </div>
                </div>

                {!isLoading && !caSearch && tokens && (
                  <div className="mb-2">
                    {tokens?.map(token => {
                      return <SearchTokenDisplay key={token.id} token={token} onClose={onClose} />;
                    })}
                  </div>
                )}

                {!isLoading && caSearch && token && (
                  <div className="mb-2">
                    <SearchTokenDisplay token={token} onClose={onClose} />
                  </div>
                )}

                {noResults && !isLoading && (
                  <p className={`mb-2 ml-2 ${!caSearch && "-mt-5"}`}>No search results match, try another search</p>
                )}

                {isLoading && <SearchSkeleton caSearch={caSearch} />}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
