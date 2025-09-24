import { ChatContainer } from "@/components/chat";
import { ChatListProvider } from "@/contexts/ChatListContext";

export default async function Dashboard() {
  return (
    <ChatListProvider>
      <ChatContainer />
    </ChatListProvider>
  );
}
