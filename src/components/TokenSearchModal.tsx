import { searchTokens } from "@/queries/token/queries";
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
  const [caSearch, setCaSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        className="bg-dark max-h-[500px] overflow-y-auto"
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
                  onChange={async (e) => {
                    if (e.target.value === "") {
                      setTokens(null);
                      return;
                    }
                    setIsLoading(true);
                    const tokens = await searchTokens(e.target.value);
                    setTokens(tokens);
                    setIsLoading(false);
                  }}
                  startContent={<FaMagnifyingGlass size={20} />}
                  endContent={
                    <div className="flex gap-x-4 items-center">
                        <div>
                        <Switch isSelected={caSearch} color="success" onValueChange={() => setCaSearch(!caSearch)}>CA</Switch>
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

                {!isLoading && (
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

                {isLoading && <SearchSkeleton />}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
