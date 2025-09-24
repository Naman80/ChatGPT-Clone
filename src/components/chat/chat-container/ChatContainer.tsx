"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useChatList } from "@/contexts/ChatListContext";
import { MobileHeader } from "./MobileHeader";
import { EmptyState } from "./EmptyState";
import { ChatView } from "./ChatView";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "../sidebar-components";

interface ChatContainerProps {
  chatId?: string;
}

export function ChatContainer({ chatId }: ChatContainerProps) {
  const { setCurrentChatId, createNewChat, chats } = useChatList();
  const searchParams = useSearchParams();
  const messageFromUrl = searchParams.get("message");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Show sidebar by default on desktop when there are chats, collapse on mobile
  // Start with collapsed state to avoid hydration mismatch, then adjust on client
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Initialize sidebar state on client-side only to avoid hydration mismatch
  useEffect(() => {
    if (!isInitialized) {
      const handleInitialResize = () => {
        if (window.innerWidth < 1024) {
          // On mobile, keep sidebar collapsed
          setIsSidebarCollapsed(true);
        } else {
          // On desktop, show sidebar if there are chats
          setIsSidebarCollapsed(chats.length === 0);
        }
        setIsInitialized(true);
      };

      handleInitialResize();
    }
  }, [chats.length, isInitialized]);

  // Update sidebar state based on window size and available chats
  useEffect(() => {
    if (!isInitialized) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // On mobile, keep sidebar collapsed
        setIsSidebarCollapsed(true);
      } else {
        // On desktop, show sidebar if there are chats
        setIsSidebarCollapsed(chats.length === 0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chats.length, isInitialized]);

  console.log("[ChatContainer] Rendering with chatId:", chatId);

  // Initialize useChat hook
  const { messages, status, error, setMessages, sendMessage } = useChat({
    id: chatId,
    onFinish: (message) => {
      console.log("[ChatContainer] Message finished:", message);
      // The API already handles persistence via onFinish callback
    },
    onError: (error) => {
      console.error("[ChatContainer] Chat error:", error);
    },
  });

  // Set current chat ID when component mounts
  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId);
    }
  }, [chatId, setCurrentChatId]);

  // Load initial messages when chatId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!chatId) {
        setMessages([]);
        setIsLoadingMessages(false);
        return;
      }

      try {
        console.log("[ChatContainer] Loading messages for chat:", chatId);
        setIsLoadingMessages(true);
        const response = await fetch(`/api/chat/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(
            "[ChatContainer] Setting initial messages:",
            data.messages.length
          );
          setMessages(data.messages || []);
        } else {
          console.error(
            "[ChatContainer] Failed to load messages:",
            response.status
          );
        }
      } catch (error) {
        console.error("[ChatContainer] Error loading messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [chatId]); // Remove setMessages dependency to prevent multiple calls

  // Handle automatic message sending when navigating to new chat with message parameter
  useEffect(() => {
    if (chatId && messageFromUrl && messages.length === 0) {
      console.log(
        "[ChatContainer] Auto-sending message from URL:",
        messageFromUrl
      );
      // Clear the URL parameter and send the message
      window.history.replaceState({}, "", `/c/${chatId}`);
      sendMessage({ text: messageFromUrl });
    }
  }, [chatId, messageFromUrl, messages.length, sendMessage]);

  const isLoading = status === "submitted" || status === "streaming";

  // Handle message submission
  const handleChatSubmit = async (messageText: string) => {
    if (!messageText.trim()) return;

    // If no chatId, create a new chat first and navigate to it
    if (!chatId) {
      console.log("[ChatContainer] Creating new chat for message...");
      const newChatId = await createNewChat();
      if (!newChatId) {
        console.error("[ChatContainer] Failed to create new chat");
        return;
      }
      // Navigate to the new chat page to ensure proper chat ID is set
      window.location.href = `/c/${newChatId}?message=${encodeURIComponent(
        messageText
      )}`;
      return;
    }

    // Send the message using the AI SDK
    console.log("[ChatContainer] Sending message to chatId:", chatId);
    await sendMessage({ text: messageText });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-full flex bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out h-full",
          !isSidebarCollapsed ? "lg:ml-0" : "lg:ml-0"
        )}
      >
        {/* Mobile Header */}
        <MobileHeader onToggleSidebar={toggleSidebar} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {!hasMessages ? (
            <EmptyState onSubmit={handleChatSubmit} isLoading={isLoading} />
          ) : (
            <ChatView
              messages={messages}
              isLoading={isLoading}
              isLoadingMessages={isLoadingMessages}
              onSubmit={handleChatSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
