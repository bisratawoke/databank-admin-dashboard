import Image from "next/image";
import EssLogo from "../../../../public/logo_ess_data_back.svg";

export default function LogoIcon() {
  return <Image src={EssLogo} alt="logo" width={40} height={36} />;
}
