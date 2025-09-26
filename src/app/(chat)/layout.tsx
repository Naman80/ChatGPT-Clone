import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Interface - Takes remaining height */}
      <main className="flex-1 min-h-0">{children}</main>
    </div>
  );
}
