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
  error: string | null;
  loadChats: () => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  // Load chats from API
  const loadChats = useCallback(async () => {
    try {
      console.log("[ChatListContext] Starting to load chats...");
      setError(null);

      const response = await fetch("/api/chats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
    }
  }, []);

  // Delete a chat
  const deleteChat = useCallback(async (chatId: string): Promise<void> => {
    try {
      console.log("[ChatListContext] Deleting chat:", chatId);
      setError(null);

      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("[ChatListContext] Chat deleted successfully:", chatId);
        setChats((prevChats) =>
          prevChats.filter((chat) => chat.chatId !== chatId)
        );
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
  }, []);

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
        const response = await fetch(`/api/chats/${chatId}`, {
          method: "PATCH",
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

  const value = React.useMemo(
    () => ({
      chats,
      error,
      loadChats,
      deleteChat,
      updateChatTitle,
    }),
    [chats, error, loadChats, deleteChat, updateChatTitle]
  );

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
