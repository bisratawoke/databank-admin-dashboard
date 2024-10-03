import { Button } from "antd";
import Link from "next/link";
export default function NavItem({
  label,
  link,
}: {
  label: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <Button
        style={{
          backgroundColor: "#166EE1",
          borderColor: "#166EE1",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "white",
            fontWeight: 400,
          }}
        >
          {label}
        </span>
      </Button>
    </Link>
  );
}
