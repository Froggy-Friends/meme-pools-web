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
};

export default function TokenSearchModal({ isOpen, onOpenChange }: TokenSearchModalProps) {
  const [tokens, setTokens] = useState<TokenSearchResult[] | null>(null);
  const [token, setToken] = useState<TokenSearchResult | null>(null);
  const [caSearch, setCaSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debounced = useDebouncedCallback(async value => {
    setIsLoading(true);
    if (!caSearch) {
      const tokens = await searchTokens(value);
      setTokens(tokens);
    } else {
      const token = await searchTokensByCa(value);
      setToken(token);
    }
    setIsLoading(false);
  }, 500);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setTokens(null);
      return;
    }
    await debounced(e.target.value);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setToken(null);
          setTokens(null);
        }}
        size="2xl"
        className="bg-dark max-h-[500px] min-h-[175px] overflow-y-auto mt-12"
        placement="top"
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
                    placeholder="search"
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
                      color="success"
                      onValueChange={() => setCaSearch(!caSearch)}
                      classNames={{
                        wrapper: ["bg-white/50"],
                      }}
                    ></Switch>
                    <p>CA</p>
                  </div>
                </div>

                <div className="flex justify-between items-center h-12 px-4">
                  <p>Token</p>

                  <div className="flex w-1/4 justify-between">
                    <p>MC</p>
                    <p>Votes</p>
                  </div>
                </div>

                {!isLoading && !caSearch && (
                  <div className="mb-2">
                    {tokens?.map(token => {
                      return <SearchTokenDisplay key={token.id} token={token} />;
                    })}
                  </div>
                )}

                {!isLoading && caSearch && token && (
                  <div className="mb-2">
                    <SearchTokenDisplay token={token} />
                  </div>
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
