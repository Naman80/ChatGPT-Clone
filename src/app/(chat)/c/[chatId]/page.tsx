import { ChatContainer } from "@/components/chat";
import { ChatListProvider } from "@/contexts/ChatListContext";

export default async function Page() {
  return (
    <ChatListProvider>
      <ChatContainer />
    </ChatListProvider>
  );
}
