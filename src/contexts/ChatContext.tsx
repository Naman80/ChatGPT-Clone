"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { Chat, Message, ChatContextType } from "@/types/chat";
import { useUser } from "@clerk/nextjs";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  isLoadingMessages: boolean;
  loadingChatIds: Set<string>; // Track which chats are currently being loaded
}

type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOADING_MESSAGES"; payload: boolean }
  | {
      type: "SET_LOADING_CHAT";
      payload: { chatId: string; isLoading: boolean };
    }
  | { type: "SET_CHATS"; payload: Chat[] }
  | { type: "ADD_CHAT"; payload: Chat }
  | { type: "SET_CURRENT_CHAT"; payload: Chat | null }
  | { type: "DELETE_CHAT"; payload: string }
  | { type: "UPDATE_CHAT"; payload: Chat }
  | { type: "ADD_MESSAGE"; payload: { chatId: string; message: Message } }
  | {
      type: "UPDATE_MESSAGE";
      payload: { chatId: string; messageId: string; content: string };
    }
  | { type: "CLEAR_CHATS" };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_LOADING_MESSAGES":
      return { ...state, isLoadingMessages: action.payload };

    case "SET_LOADING_CHAT": {
      const newLoadingIds = new Set(state.loadingChatIds);
      if (action.payload.isLoading) {
        newLoadingIds.add(action.payload.chatId);
      } else {
        newLoadingIds.delete(action.payload.chatId);
      }
      return { ...state, loadingChatIds: newLoadingIds };
    }

    case "SET_CHATS":
      return { ...state, chats: action.payload };

    case "ADD_CHAT":
      return {
        ...state,
        chats: [action.payload, ...state.chats],
        currentChat: action.payload,
      };

    case "SET_CURRENT_CHAT":
      return { ...state, currentChat: action.payload };

    case "DELETE_CHAT":
      const filteredChats = state.chats.filter(
        (chat) => chat.id !== action.payload
      );
      const newCurrentChat =
        state.currentChat?.id === action.payload
          ? filteredChats.length > 0
            ? filteredChats[0]
            : null
          : state.currentChat;
      return {
        ...state,
        chats: filteredChats,
        currentChat: newCurrentChat,
      };

    case "UPDATE_CHAT":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.id
            ? {
                ...chat,
                ...action.payload,
                // Ensure we preserve existing properties and explicitly handle messages
                title: action.payload.title ?? chat.title,
                createdAt: action.payload.createdAt ?? chat.createdAt,
                updatedAt: action.payload.updatedAt ?? chat.updatedAt,
                messages: action.payload.messages ?? chat.messages,
              }
            : chat
        ),
        currentChat:
          state.currentChat?.id === action.payload.id
            ? {
                ...state.currentChat,
                ...action.payload,
                title: action.payload.title ?? state.currentChat.title,
                createdAt:
                  action.payload.createdAt ?? state.currentChat.createdAt,
                updatedAt:
                  action.payload.updatedAt ?? state.currentChat.updatedAt,
                messages: action.payload.messages ?? state.currentChat.messages,
              }
            : state.currentChat,
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? { ...chat, messages: [...chat.messages, action.payload.message] }
            : chat
        ),
        currentChat:
          state.currentChat?.id === action.payload.chatId
            ? {
                ...state.currentChat,
                messages: [
                  ...state.currentChat.messages,
                  action.payload.message,
                ],
              }
            : state.currentChat,
      };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === action.payload.messageId
                    ? {
                        ...msg,
                        content: action.payload.content,
                        isStreaming: false,
                      }
                    : msg
                ),
              }
            : chat
        ),
        currentChat:
          state.currentChat?.id === action.payload.chatId
            ? {
                ...state.currentChat,
                messages: state.currentChat.messages.map((msg) =>
                  msg.id === action.payload.messageId
                    ? {
                        ...msg,
                        content: action.payload.content,
                        isStreaming: false,
                      }
                    : msg
                ),
              }
            : state.currentChat,
      };

    case "CLEAR_CHATS":
      return { ...state, chats: [], currentChat: null };

    default:
      return state;
  }
};

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  isLoading: false,
  isLoadingMessages: false,
  loadingChatIds: new Set(),
};

interface ChatProviderProps {
  children: React.ReactNode;
  chatId?: string;
}

export function ChatProvider({ children, chatId }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, isLoaded } = useUser();

  console.log("[ChatProvider] Initialized with:", {
    chatId,
    hasUser: !!user,
    isLoaded,
    userId: user?.id,
  });

  // Load chats from API on mount
  useEffect(() => {
    if (isLoaded && user?.id) {
      console.log(
        "[ChatContext] User authenticated and loaded, loading chats for:",
        user.id
      );
      loadChats();
    } else {
      console.log("[ChatContext] User not authenticated or not loaded yet:", {
        isLoaded,
        userId: user?.id,
      });
    }
  }, [isLoaded, user?.id]);

  // Load messages for a specific chat
  const loadMessagesForChat = useCallback(
    async (chatId: string) => {
      // Prevent loading the same chat multiple times simultaneously
      if (state.loadingChatIds.has(chatId)) {
        console.log(
          `[ChatContext] Already loading messages for chat: ${chatId}, skipping`
        );
        return;
      }

      try {
        console.log(`[ChatContext] Loading messages for chat: ${chatId}`);

        // Add to loading set
        const newLoadingIds = new Set(state.loadingChatIds);
        newLoadingIds.add(chatId);
        dispatch({
          type: "SET_LOADING_CHAT",
          payload: { chatId, isLoading: true },
        });
        dispatch({ type: "SET_LOADING_MESSAGES", payload: true });

        const response = await fetch(`/api/messages?chatId=${chatId}`);
        if (response.ok) {
          const fetchedMessages = await response.json();
          console.log(
            `[ChatContext] Fetched ${fetchedMessages.length} messages for chat ${chatId}:`,
            fetchedMessages
          );

          const formattedMessages = fetchedMessages.map(
            (msg: {
              _id?: string;
              id?: string;
              content: string;
              role: string;
              timestamp: string;
            }) => ({
              id: msg._id || msg.id,
              content: msg.content,
              role: msg.role,
              timestamp: new Date(msg.timestamp),
              isStreaming: false,
            })
          );

          console.log(`[ChatContext] Formatted messages:`, formattedMessages);

          // Update the current chat with messages
          const updatePayload = {
            id: chatId,
            messages: formattedMessages,
          };
          console.log(
            `[ChatContext] Dispatching UPDATE_CHAT with:`,
            updatePayload
          );

          dispatch({
            type: "UPDATE_CHAT",
            payload: updatePayload as Chat,
          });

          console.log(
            `[ChatContext] Successfully updated chat ${chatId} with ${formattedMessages.length} messages`
          );
        }
      } catch (error) {
        console.error("Failed to load messages for chat:", error);
      } finally {
        // Remove from loading set
        dispatch({
          type: "SET_LOADING_CHAT",
          payload: { chatId, isLoading: false },
        });
        dispatch({ type: "SET_LOADING_MESSAGES", payload: false });
      }
    },
    [state.loadingChatIds]
  );

  // Load specific chat when chatId is provided
  useEffect(() => {
    console.log(`[ChatContext] useEffect triggered with:`, {
      chatId,
      hasChats: state.chats.length > 0,
      chatsCount: state.chats.length,
      currentChatId: state.currentChat?.id,
    });

    if (chatId && state.chats.length > 0) {
      const targetChat = state.chats.find((chat) => chat.id === chatId);
      console.log(
        `[ChatContext] Looking for chat ${chatId}, found:`,
        !!targetChat
      );

      if (targetChat) {
        console.log(`[ChatContext] Setting current chat to: ${chatId}`);

        // Only set as current if it's different from the current chat
        if (!state.currentChat || state.currentChat.id !== chatId) {
          dispatch({ type: "SET_CURRENT_CHAT", payload: targetChat });
        }

        // Load messages if this chat doesn't have any messages yet
        if (!targetChat.messages || targetChat.messages.length === 0) {
          console.log(`[ChatContext] Loading messages for new chat: ${chatId}`);
          loadMessagesForChat(chatId);
        }
      }
    }
  }, [chatId, state.chats, loadMessagesForChat]);

  // Load messages for current chat if we don't have any (handles page refresh when no chatId in URL)
  useEffect(() => {
    // Only load if we have a current chat, no messages, not already loading, and no explicit chatId from URL
    if (
      !chatId &&
      state.currentChat &&
      state.chats.length > 0 &&
      (!state.currentChat.messages ||
        state.currentChat.messages.length === 0) &&
      !state.isLoadingMessages
    ) {
      // Double check that this chat actually exists in our chats list to avoid loading deleted chats
      const chatExists = state.chats.some(
        (chat) => chat.id === state.currentChat!.id
      );
      if (chatExists) {
        console.log(
          `[ChatContext] Loading messages for current chat (no URL chatId): ${state.currentChat.id}`
        );
        loadMessagesForChat(state.currentChat.id);
      }
    }
  }, [
    chatId,
    state.currentChat?.id,
    state.chats.length,
    state.isLoadingMessages,
    loadMessagesForChat,
  ]);

  const loadChats = async () => {
    try {
      console.log("[ChatContext] Starting to load chats...");
      dispatch({ type: "SET_LOADING", payload: true });

      // Fetch chats
      const response = await fetch("/api/chats");

      console.log("[ChatContext] API response status:", response.status);

      if (response.status === 401) {
        console.error("[ChatContext] Unauthorized - user not authenticated");
        return;
      }

      if (response.ok) {
        const chats = await response.json();
        console.log("[ChatContext] Successfully loaded chats:", {
          count: chats.length,
          chatIds: chats.map((c: Chat) => c.id),
        });
        dispatch({ type: "SET_CHATS", payload: chats });
        console.log("[ChatContext] Chats dispatched to state");
      } else {
        const errorText = await response.text();
        console.error(
          "[ChatContext] Failed to load chats:",
          response.status,
          errorText
        );
      }
    } catch (error) {
      console.error("[ChatContext] Error loading chats:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createChat = useCallback(async (): Promise<Chat | undefined> => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });

      if (response.ok) {
        const newChat = await response.json();
        dispatch({ type: "ADD_CHAT", payload: newChat });
        // Navigate to the new chat using window.history
        window.history.pushState({}, "", `/c/${newChat.id}`);
        return newChat;
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
    return undefined;
  }, []);

  const selectChat = useCallback(
    (chatId: string) => {
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        dispatch({ type: "SET_CURRENT_CHAT", payload: chat });
      }
    },
    [state.chats]
  );

  const deleteChat = useCallback(async (chatId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({ type: "DELETE_CHAT", payload: chatId });
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  }, []);

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    // This is a placeholder - actual sending will be handled by the Vercel AI SDK hook
    console.log("Sending message:", content);
  }, []);

  const addMessageOptimistically = useCallback(
    (chatId: string, content: string, role: "user" | "assistant" = "user") => {
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}-${Math.random()}`,
        content,
        role,
        timestamp: new Date(),
        isStreaming: role === "assistant",
      };

      dispatch({
        type: "ADD_MESSAGE",
        payload: { chatId, message: optimisticMessage },
      });

      return optimisticMessage.id;
    },
    []
  );

  const updateMessage = useCallback(
    (chatId: string, messageId: string, content: string) => {
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: { chatId, messageId, content },
      });
    },
    []
  );

  const clearChats = useCallback(() => {
    dispatch({ type: "CLEAR_CHATS" });
  }, []);

  const value: ChatContextType = {
    chats: state.chats,
    currentChat: state.currentChat,
    isLoading: state.isLoading,
    isLoadingMessages: state.isLoadingMessages,
    createChat,
    selectChat,
    deleteChat,
    sendMessage,
    addMessageOptimistically,
    updateMessage,
    clearChats,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
