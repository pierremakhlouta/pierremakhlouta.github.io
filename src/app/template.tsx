import OnlineObserver from "@/components/OnlineObserver";

// Remounts on every navigation: plays the page-enter transition and rescans
// the page for nodes to bring online.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter">
      {children}
      <OnlineObserver />
    </div>
  );
}
