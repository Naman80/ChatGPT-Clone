export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      {/* Chat Interface - Takes remaining height */}
      <main className="flex-1 min-h-0">{children}</main>
    </div>
  );
}
