import { ChatContainer } from "@/components/chat";
import { ChatListProvider } from "@/contexts/ChatListContext";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  return (
    <ChatListProvider>
      <ChatContainer chatId={chatId} />
    </ChatListProvider>
  );
}
