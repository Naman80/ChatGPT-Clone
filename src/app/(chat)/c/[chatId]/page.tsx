import { ChatInterface } from "@/components/chat/ChatInterface";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  return <ChatInterface chatId={chatId} />;
}
