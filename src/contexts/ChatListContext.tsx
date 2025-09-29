"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";

export interface ChatItem {
  chatId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatListContextType {
  chats: ChatItem[];
  isLoading: boolean;
  error: string | null;
  currentChatId: string | null;
  setCurrentChatId: (chatId: string | null) => void;
  loadChats: () => Promise<void>;
  createNewChat: () => Promise<string | null>;
  deleteChat: (chatId: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
}

const ChatListContext = createContext<ChatListContextType | undefined>(
  undefined
);

interface ChatListProviderProps {
  children: React.ReactNode;
}

export function ChatListProvider({ children }: ChatListProviderProps) {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  console.log("[ChatListProvider] Initialized with:", {
    hasUser: !!user,
    isLoaded,
    userId: user?.id,
  });

  // Load chats from API
  const loadChats = useCallback(async () => {
    try {
      console.log("[ChatListContext] Starting to load chats...");
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/chats");

      console.log("[ChatListContext] API response status:", response.status);

      if (response.status === 401) {
        console.error(
          "[ChatListContext] Unauthorized - user not authenticated"
        );
        setError("Authentication required");
        return;
      }

      if (response.ok) {
        const chatsData = await response.json();
        console.log("[ChatListContext] Successfully loaded chats:", {
          count: chatsData.length,
          chatIds: chatsData.map((c: ChatItem) => c.chatId),
        });

        // Parse dates
        const formattedChats = chatsData.map(
          (chat: ChatItem & { createdAt: string; updatedAt: string }) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
          })
        );

        setChats(formattedChats);
        console.log("[ChatListContext] Chats loaded into state");
      } else {
        const errorText = await response.text();
        console.error(
          "[ChatListContext] Failed to load chats:",
          response.status,
          errorText
        );
        setError(`Failed to load chats: ${response.status}`);
      }
    } catch (error) {
      console.error("[ChatListContext] Error loading chats:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new chat
  const createNewChat = useCallback(async (): Promise<string | null> => {
    try {
      console.log("[ChatListContext] Creating new chat...");
      setError(null);

      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });

      if (response.ok) {
        const newChat = await response.json();
        console.log("[ChatListContext] New chat created:", newChat.id);

        // Format dates
        const formattedChat = {
          ...newChat,
          createdAt: new Date(newChat.createdAt),
          updatedAt: new Date(newChat.updatedAt),
        };

        // Add to the beginning of the chats array
        setChats((prevChats) => [formattedChat, ...prevChats]);
        setCurrentChatId(newChat.id);
        return newChat.id;
      } else {
        const errorText = await response.text();
        console.error(
          "[ChatListContext] Failed to create chat:",
          response.status,
          errorText
        );
        setError(`Failed to create chat: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error("[ChatListContext] Error creating chat:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      return null;
    }
  }, []);

  // Delete a chat
  const deleteChat = useCallback(
    async (chatId: string): Promise<void> => {
      try {
        console.log("[ChatListContext] Deleting chat:", chatId);
        setError(null);

        const response = await fetch(`/api/chat/${chatId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log("[ChatListContext] Chat deleted successfully:", chatId);
          setChats((prevChats) =>
            prevChats.filter((chat) => chat.chatId !== chatId)
          );

          // If the deleted chat was the current one, clear the current chat
          if (currentChatId === chatId) {
            setCurrentChatId(null);
          }
        } else {
          const errorText = await response.text();
          console.error(
            "[ChatListContext] Failed to delete chat:",
            response.status,
            errorText
          );
          setError(`Failed to delete chat: ${response.status}`);
        }
      } catch (error) {
        console.error("[ChatListContext] Error deleting chat:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    },
    [currentChatId]
  );

  // Update chat title
  const updateChatTitle = useCallback(
    async (chatId: string, title: string): Promise<void> => {
      try {
        console.log("[ChatListContext] Updating chat title:", {
          chatId,
          title,
        });
        setError(null);

        // Optimistically update the title
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === chatId
              ? { ...chat, title, updatedAt: new Date() }
              : chat
          )
        );

        // Send update to server
        const response = await fetch(`/api/chat/${chatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });

        if (!response.ok) {
          // Revert optimistic update on failure
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.chatId === chatId
                ? { ...chat, title: chat.title, updatedAt: chat.updatedAt }
                : chat
            )
          );

          const errorText = await response.text();
          console.error(
            "[ChatListContext] Failed to update chat title:",
            response.status,
            errorText
          );
          setError(`Failed to update chat title: ${response.status}`);
        } else {
          console.log("[ChatListContext] Chat title updated successfully");
        }
      } catch (error) {
        console.error("[ChatListContext] Error updating chat title:", error);
        setError(error instanceof Error ? error.message : "Unknown error");

        // Revert optimistic update on error
        await loadChats();
      }
    },
    [loadChats]
  );

  // Load chats when user is authenticated
  useEffect(() => {
    if (isLoaded && user?.id) {
      console.log(
        "[ChatListContext] User authenticated and loaded, loading chats for:",
        user.id
      );
      loadChats();
    } else {
      console.log(
        "[ChatListContext] User not authenticated or not loaded yet:",
        {
          isLoaded,
          userId: user?.id,
        }
      );
    }
  }, [isLoaded, user?.id, loadChats]);

  const value: ChatListContextType = {
    chats,
    isLoading,
    error,
    currentChatId,
    setCurrentChatId,
    loadChats,
    createNewChat,
    deleteChat,
    updateChatTitle,
  };

  return (
    <ChatListContext.Provider value={value}>
      {children}
    </ChatListContext.Provider>
  );
}

export function useChatList() {
  const context = useContext(ChatListContext);
  if (context === undefined) {
    throw new Error("useChatList must be used within a ChatListProvider");
  }
  return context;
}
