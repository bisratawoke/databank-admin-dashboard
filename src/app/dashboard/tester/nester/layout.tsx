export default function Layout({ children }: { children: React.ReactNode }) {
  throw new Error("nester layout error");
  return <div>{children}</div>;
}
