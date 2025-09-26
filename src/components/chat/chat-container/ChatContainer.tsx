"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { EmptyState } from "./EmptyState";
import { ChatView } from "./ChatView";
import { Sidebar } from "../sidebar-components";
import { NewChatInput } from "../input";
import { ChatHeader } from "./ChatHeader";
import { DefaultChatTransport, UIMessage } from "ai";

interface ChatContainerProps {
  chatId?: string;
}

export function ChatContainer({ chatId }: ChatContainerProps) {
  console.log(chatId);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(!!chatId); // Only load if chatId exists
  const [error, setError] = useState<string | null>(null);

  // Fetch initial messages when chatId is present
  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      setInitialMessages([]);
      return;
    }

    async function fetchMessages() {
      try {
        setLoading(true);
        const response = await fetch(`/api/chats/${chatId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.success) {
          setInitialMessages(result.data);
        } else {
          setError(result.error || "Failed to fetch messages");
        }
      } catch (err) {
        setError(
          `An error occurred: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [chatId]);

  // Initialize useChat with fetched messages
  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: chatId ? `/api/chats/${chatId}` : `/api/chats`,
    }),
    onData: (data) => {
      console.log(data, "data part is received");
    },
  });

  console.log("meessages", messages, initialMessages);

  // Show sidebar by default on desktop when there are chats, collapse on mobile
  // Start with collapsed state to avoid hydration mismatch, then adjust on client
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // // Initialize sidebar state on client-side only to avoid hydration mismatch
  // useEffect(() => {
  //   if (!isInitialized) {
  //     const handleInitialResize = () => {
  //       if (window.innerWidth < 1024) {
  //         // On mobile, keep sidebar collapsed
  //         setIsSidebarCollapsed(true);
  //       } else {
  //         // On desktop, show sidebar if there are chats
  //         setIsSidebarCollapsed(chats.length === 0);
  //       }
  //       setIsInitialized(true);
  //     };

  //     handleInitialResize();
  //   }
  // }, [chats.length, isInitialized]);

  // // Update sidebar state based on window size and available chats
  // useEffect(() => {
  //   if (!isInitialized) return;

  //   const handleResize = () => {
  //     if (window.innerWidth < 1024) {
  //       // On mobile, keep sidebar collapsed
  //       setIsSidebarCollapsed(true);
  //     } else {
  //       // On desktop, show sidebar if there are chats
  //       setIsSidebarCollapsed(chats.length === 0);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [chats.length, isInitialized]);

  // // Listen for browser navigation changes (back/forward buttons)
  // useEffect(() => {
  //   const handlePopState = () => {
  //     const currentPath = window.location.pathname;
  //     const chatIdFromPath = currentPath.split("/c/")[1];
  //     setCurrentChatIdFromUrl(chatIdFromPath || null);
  //     if (chatIdFromPath) {
  //       setCurrentChatId(chatIdFromPath);
  //     }
  //   };

  //   window.addEventListener("popstate", handlePopState);
  //   return () => window.removeEventListener("popstate", handlePopState);
  // }, [setCurrentChatId]);

  // // Update current chat ID when URL changes
  // useEffect(() => {
  //   const chatIdFromPath = pathname.split("/c/")[1];
  //   if (chatIdFromPath !== currentChatIdFromUrl) {
  //     setCurrentChatIdFromUrl(chatIdFromPath || null);
  //   }
  // }, [pathname, currentChatIdFromUrl]);

  // // Use the chat ID from URL or props
  // const effectiveChatId = currentChatIdFromUrl || chatId;

  // console.log("[ChatContainer] Rendering with chatId:", effectiveChatId);

  // // Initialize useChat hook
  // const { messages, status, error, setMessages, sendMessage } = useChat({
  //   id: effectiveChatId,
  //   onFinish: (message) => {
  //     console.log("[ChatContainer] Message finished:", message);
  //     // The API already handles persistence via onFinish callback
  //   },
  //   onError: (error) => {
  //     console.error("[ChatContainer] Chat error:", error);
  //   },
  // });

  // // Set current chat ID when component mounts or effective chat ID changes
  // useEffect(() => {
  //   if (effectiveChatId) {
  //     setCurrentChatId(effectiveChatId);
  //   }
  // }, [effectiveChatId, setCurrentChatId]);

  // // Load initial messages when chatId changes
  // useEffect(() => {
  //   const loadMessages = async () => {
  //     if (!effectiveChatId) {
  //       setMessages([]);
  //       setIsLoadingMessages(false);
  //       return;
  //     }

  //     try {
  //       console.log(
  //         "[ChatContainer] Loading messages for chat:",
  //         effectiveChatId
  //       );
  //       setIsLoadingMessages(true);
  //       const response = await fetch(`/api/chat/${effectiveChatId}`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log(
  //           "[ChatContainer] Setting initial messages:",
  //           data.messages.length
  //         );
  //         setMessages(data.messages || []);
  //       } else {
  //         console.error(
  //           "[ChatContainer] Failed to load messages:",
  //           response.status
  //         );
  //       }
  //     } catch (error) {
  //       console.error("[ChatContainer] Error loading messages:", error);
  //     } finally {
  //       setIsLoadingMessages(false);
  //     }
  //   };

  //   loadMessages();
  // }, [effectiveChatId]); // Remove setMessages dependency to prevent multiple calls

  // // Handle automatic message sending when navigating to new chat with message parameter
  // useEffect(() => {
  //   if (effectiveChatId && messageFromUrl && messages.length === 0) {
  //     console.log(
  //       "[ChatContainer] Auto-sending message from URL:",
  //       messageFromUrl
  //     );
  //     // Clear the URL parameter and send the message
  //     window.history.replaceState({}, "", `/c/${effectiveChatId}`);
  //     sendMessage({ text: messageFromUrl });
  //   }
  // }, [effectiveChatId, messageFromUrl, messages.length, sendMessage]);

  // const isLoading = status === "submitted" || status === "streaming";

  // // Handle message submission
  // const handleChatSubmit = async (messageText: string) => {
  //   if (!messageText.trim()) return;

  //   // If no effectiveChatId, create a new chat first and navigate to it
  //   if (!effectiveChatId) {
  //     console.log("[ChatContainer] Creating new chat for message...");
  //     const newChatId = await createNewChat();
  //     if (!newChatId) {
  //       console.error("[ChatContainer] Failed to create new chat");
  //       return;
  //     }
  //     // Navigate to the new chat page to ensure proper chat ID is set
  //     window.history.pushState(
  //       {},
  //       "",
  //       `/c/${newChatId}?message=${encodeURIComponent(messageText)}`
  //     );
  //     setCurrentChatIdFromUrl(newChatId);
  //     return;
  //   }

  //   // Send the message using the AI SDK
  //   console.log("[ChatContainer] Sending message to chatId:", effectiveChatId);
  //   await sendMessage({ text: messageText });
  // };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile Header */}
        <ChatHeader onToggleSidebar={toggleSidebar} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {!hasMessages ? (
            <EmptyState />
          ) : (
            <ChatView
              messages={messages}
              isLoading={status === "submitted" || status === "streaming"}
              isLoadingMessages={status === "streaming"}
            />
          )}
        </div>

        <NewChatInput
          onSubmit={(data) => {
            console.log(data);
            sendMessage({ text: data });
          }}
          isLoading={status === "submitted" || status === "streaming"}
        />
      </div>
    </div>
  );
}
