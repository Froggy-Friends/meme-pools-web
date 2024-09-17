import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function SolConnectButton() {
  return (
    <WalletMultiButton
      style={{
        backgroundColor: "#00DA6C",
        color: "black",
        display: "flex",
        justifyItems: "center",
        justifyContent: "center",
        fontSize: 14,
        height: 32,
        width: 146,
      }}
    />
  );
}
