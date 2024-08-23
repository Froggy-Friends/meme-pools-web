import Image from "next/image";
import frogFunLogo from "../../public/frog-fun-logo.png";

export default function Logo() {
  return <Image src={frogFunLogo} alt="Frog Fun Logo" height={70} width={70} />;
}
