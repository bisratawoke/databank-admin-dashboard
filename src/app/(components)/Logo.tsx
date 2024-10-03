import Image from "next/image";
import EssLogo from "../../public/logo_ess_data_back 1.svg";

export default function Logo() {
  return <Image src={EssLogo} alt="logo" width={40} height={36} />;
}
