import { ChatContainer } from "@/components/chat";
import { ChatListProvider } from "@/contexts/ChatListContext";

export default async function Page(props: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await props.params;
  console.log(chatId, "grtg");
  return (
    <ChatListProvider>
      <ChatContainer chatId={chatId} />
    </ChatListProvider>
  );
}
