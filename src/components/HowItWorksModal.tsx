import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

type HowItWorkdsModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function HowItWorksModal({
  isOpen,
  onOpenChange,
}: HowItWorkdsModalProps) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                How It Works
              </ModalHeader>
              <ModalBody>
                <p>
                  Frog prevents rugs by making sure that all created tokens are
                  safe. Each coin on pump is a fair-launch with no presale and
                  no team allocation.
                </p>
                <p>Step 1: pick a coin that you like</p>
                <p>Step 2: buy the coin on the bonding curve</p>
                <p>
                  Step 3: sell at any time to lock in your profits or losses
                </p>
                <p>
                  Step 4: when enough people buy on the bonding curve it reaches
                  a market cap of $69k
                </p>
                <p>
                  Step 5: $12k of liquidity is then deposited in raydium and
                  burned
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
