"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { Chat, Message, ChatContextType } from "@/types/chat";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
}

type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
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
          chat.id === action.payload.id ? action.payload : chat
        ),
        currentChat:
          state.currentChat?.id === action.payload.id
            ? action.payload
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
  chats: [
    {
      id: "1",
      title: "AI UI code prompt",
      messages: [
        {
          id: "1-1",
          content: "Help me create a modern UI component for a chat interface",
          role: "user",
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
          id: "1-2",
          content:
            "I'd be happy to help you create a modern UI component for a chat interface! Here's a comprehensive approach...",
          role: "assistant",
          timestamp: new Date(Date.now() - 3590000),
        },
      ],
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3590000),
    },
    {
      id: "2",
      title: "ChatGPT clone doc generation",
      messages: [
        {
          id: "2-1",
          content: "Generate documentation for a ChatGPT clone application",
          role: "user",
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        },
      ],
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      title: "Scalable architecture flow",
      messages: [],
      createdAt: new Date(Date.now() - 10800000), // 3 hours ago
      updatedAt: new Date(Date.now() - 10800000),
    },
    {
      id: "4",
      title: "ChatGPT client design",
      messages: [],
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: "5",
      title: "Create GitHub profile page",
      messages: [],
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000),
    },
    {
      id: "6",
      title: "Email/Interview answers",
      messages: [],
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      updatedAt: new Date(Date.now() - 259200000),
    },
    {
      id: "7",
      title: "BACKEND CONCEPTS",
      messages: [],
      createdAt: new Date(Date.now() - 604800000), // 1 week ago
      updatedAt: new Date(Date.now() - 604800000),
    },
    {
      id: "8",
      title: "Simplifying Cassandra expla...",
      messages: [],
      createdAt: new Date(Date.now() - 1209600000), // 2 weeks ago
      updatedAt: new Date(Date.now() - 1209600000),
    },
  ],
  currentChat: null,
  isLoading: false,
};

// Mock AI response function - in a real app, this would call your AI service
const mockAIResponse = async (userMessage: string): Promise<string> => {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  const responses = [
    "I understand what you're asking about. Let me help you with that.",
    "That's an interesting question! Here's what I think about it:",
    "Based on your message, I can provide some insights:",
    "Thank you for sharing that. Here's my perspective:",
    "I'd be happy to help you with this topic. Let me explain:",
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];
  return `${randomResponse} You mentioned: "${userMessage}". This is a simulated response that would normally come from an AI service. In a real implementation, this would be replaced with actual AI API calls.`;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const createChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: "ADD_CHAT", payload: newChat });
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

  const deleteChat = useCallback((chatId: string) => {
    dispatch({ type: "DELETE_CHAT", payload: chatId });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.currentChat) {
        // Create a new chat if none exists
        const newChat: Chat = {
          id: Date.now().toString(),
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dispatch({ type: "ADD_CHAT", payload: newChat });

        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          content,
          role: "user",
          timestamp: new Date(),
        };
        dispatch({
          type: "ADD_MESSAGE",
          payload: { chatId: newChat.id, message: userMessage },
        });

        // Add streaming assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "",
          role: "assistant",
          timestamp: new Date(),
          isStreaming: true,
        };
        dispatch({
          type: "ADD_MESSAGE",
          payload: { chatId: newChat.id, message: assistantMessage },
        });

        // Simulate streaming response
        try {
          const response = await mockAIResponse(content);
          dispatch({
            type: "UPDATE_MESSAGE",
            payload: {
              chatId: newChat.id,
              messageId: assistantMessage.id,
              content: response,
            },
          });
        } catch (error) {
          dispatch({
            type: "UPDATE_MESSAGE",
            payload: {
              chatId: newChat.id,
              messageId: assistantMessage.id,
              content: "Sorry, there was an error processing your request.",
            },
          });
        }
      } else {
        // Add to existing chat
        const userMessage: Message = {
          id: Date.now().toString(),
          content,
          role: "user",
          timestamp: new Date(),
        };
        dispatch({
          type: "ADD_MESSAGE",
          payload: { chatId: state.currentChat.id, message: userMessage },
        });

        // Add streaming assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "",
          role: "assistant",
          timestamp: new Date(),
          isStreaming: true,
        };
        dispatch({
          type: "ADD_MESSAGE",
          payload: { chatId: state.currentChat.id, message: assistantMessage },
        });

        // Update chat title if it's the first message
        if (state.currentChat.messages.length === 0) {
          const updatedChat = {
            ...state.currentChat,
            title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
            updatedAt: new Date(),
          };
          dispatch({ type: "UPDATE_CHAT", payload: updatedChat });
        }

        // Simulate streaming response
        try {
          const response = await mockAIResponse(content);
          dispatch({
            type: "UPDATE_MESSAGE",
            payload: {
              chatId: state.currentChat.id,
              messageId: assistantMessage.id,
              content: response,
            },
          });
        } catch (error) {
          dispatch({
            type: "UPDATE_MESSAGE",
            payload: {
              chatId: state.currentChat.id,
              messageId: assistantMessage.id,
              content: "Sorry, there was an error processing your request.",
            },
          });
        }
      }
    },
    [state.currentChat]
  );

  const clearChats = useCallback(() => {
    dispatch({ type: "CLEAR_CHATS" });
  }, []);

  const value: ChatContextType = {
    chats: state.chats,
    currentChat: state.currentChat,
    isLoading: state.isLoading,
    createChat,
    selectChat,
    deleteChat,
    sendMessage,
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
