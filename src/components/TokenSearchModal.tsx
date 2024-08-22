import { searchTokens, searchTokensByCa } from "@/queries/token/queries";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Switch,
} from "@nextui-org/react";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdKeyboardCommandKey } from "react-icons/md";
import SearchTokenDisplay from "./SearchTokenDisplay";
import { Chain } from "@/models/chain";
import SearchSkeleton from "./SearchSkeleton";
import { TokenWithVoteCount } from "@/types/token/types";

type TokenSearchModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  chain: Chain;
};

export default function TokenSearchModal({
  isOpen,
  onOpenChange,
  chain,
}: TokenSearchModalProps) {
  const [tokens, setTokens] = useState<TokenWithVoteCount[] | null>(null);
  const [token, setToken] = useState<TokenWithVoteCount | null>(null);
  const [caSearch, setCaSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setTokens(null);
      return;
    }

    if (caSearch === false) {
      setIsLoading(true);
      const tokens = await searchTokens(e.target.value);
      setTokens(tokens);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const token = await searchTokensByCa(e.target.value);
      setToken(token);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        className="bg-dark max-h-[500px] min-h-[175px] overflow-y-auto"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader></ModalHeader>
              <ModalBody className="flex flex-col">
                <Input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="search"
                  radius="full"
                  variant="faded"
                  autoComplete="off"
                  classNames={{
                    innerWrapper: ["bg-dark-gray", "text-white"],
                    inputWrapper: ["bg-dark-gray"],
                  }}
                  onChange={(e) => {
                    handleSearch(e);
                  }}
                  startContent={<FaMagnifyingGlass size={20} />}
                  endContent={
                    <div className="flex gap-x-6 items-center">
                      <div className="flex items-center">
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
                      <div className="flex gap-x-1 items-center">
                        <MdKeyboardCommandKey size={20} />
                        <p>K</p>
                      </div>
                    </div>
                  }
                />
                <div className="flex justify-between items-center h-12 px-4">
                  <p>Token</p>

                  <div className="flex w-1/4 justify-between">
                    <p>MC</p>
                    <p>Votes</p>
                  </div>
                </div>

                {!isLoading && !caSearch && (
                  <div className="mb-2">
                    {tokens?.map((token) => {
                      return (
                        <SearchTokenDisplay
                          key={token.id}
                          token={token}
                          chain={chain}
                        />
                      );
                    })}
                  </div>
                )}

                {!isLoading && caSearch && token && (
                  <div className="mb-2">
                    <SearchTokenDisplay token={token} chain={chain} />
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
