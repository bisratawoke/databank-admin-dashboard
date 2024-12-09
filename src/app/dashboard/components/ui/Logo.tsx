import LogoIcon from "./LogoIcon";
import Link from "next/link";
export default function Logo() {
  return (
    <Link
      href="/dashboard/organization"
      className="flex items-center gap-2 hover:cursor-pointer"
    >
      <LogoIcon />
      <span className="text-[17px]/[24px] text-white font-[675]">
        ESS Data Sphere
      </span>
    </Link>
  );
}
