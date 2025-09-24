export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  isLoadingMessages: boolean;
  createChat: () => Promise<Chat | undefined>;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  addMessageOptimistically: (
    chatId: string,
    content: string,
    role?: "user" | "assistant"
  ) => string;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  clearChats: () => void;
}
