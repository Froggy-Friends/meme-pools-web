import Image from "next/image";
import frogFunLogo from "../../public/frog-fun-logo.svg";

type LogoProps = {
  height?: number;
  width?: number;
};

export default function Logo({ height = 70, width = 70 }: LogoProps) {
  return <Image src={frogFunLogo} alt="Frog Fun Logo" height={height} width={width} />;
}
