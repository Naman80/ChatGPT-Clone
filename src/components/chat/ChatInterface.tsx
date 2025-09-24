"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MenuIcon, MoreVertical } from "lucide-react";

function ChatInterfaceContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { currentChat } = useChat();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const hasMessages = currentChat && currentChat.messages.length > 0;

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          !isSidebarCollapsed ? "lg:ml-0" : "lg:ml-0"
        )}
      >
        {/* Mobile Header - Always visible on mobile */}
        <div className="flex items-center justify-between p-4 lg:hidden bg-white border-b border-gray-200 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Area */}
        {!hasMessages ? (
          // Empty state with centered content
          <div className="flex-1 flex flex-col lg:hidden">
            {/* Center content */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center">
                <h1 className="text-3xl font-normal text-gray-900 leading-tight">
                  What &apos;t s on the agenda today?
                </h1>
              </div>
            </div>

            {/* Sticky input at bottom */}
            <div className="flex-shrink-0 p-4 pb-6">
              <ChatInput />
            </div>
          </div>
        ) : (
          // Chat view with messages
          <>
            <MessageList />
            <div className="flex-shrink-0">
              <ChatInput />
            </div>
          </>
        )}

        {/* Desktop view */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1">
          <MessageList />
          <div className="flex-shrink-0">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatInterface({ chatId }: { chatId?: string }) {
  console.log("[ChatInterface] Received chatId:", chatId);

  return (
    <ChatProvider chatId={chatId}>
      <ChatInterfaceContent />
    </ChatProvider>
  );
}
