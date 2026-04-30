import { Sidebar } from "@/components/ui/sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-hidden p-3 lg:p-6 z-10">
        {children}
      </main>
    </div>
  );
}
