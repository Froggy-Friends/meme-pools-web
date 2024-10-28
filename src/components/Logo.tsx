import Image from "next/image";
import memepoolsLogo from "../../public/memepools.svg";

type LogoProps = {
  height?: number;
  width?: number;
};

export default function Logo({ height = 70, width = 70 }: LogoProps) {
  return <Image src={memepoolsLogo} alt="Memepools" height={height} width={width} />;
}
