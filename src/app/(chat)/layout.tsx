import { UserButton } from "@clerk/nextjs";
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
    <div className="h-screen">
      {/* Desktop Header - Hidden on mobile */}
      <header className="hidden lg:block bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <h1 className="text-xl font-semibold text-gray-900">
              ChatGPT Clone
            </h1>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface - Full height on mobile, flex-1 on desktop */}
      <div className="h-full lg:flex-1 lg:overflow-hidden">{children}</div>
    </div>
  );
}
