import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ChatListProvider } from "@/contexts/ChatListContext";
import { ChatContainer } from "@/components/chat";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <ChatListProvider>
      <ChatContainer />
    </ChatListProvider>
  );
}
