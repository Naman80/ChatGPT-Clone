"use client";

import React, { useState } from "react";
import {
  XIcon,
  PenSquareIcon,
  SearchIcon,
  MoreHorizontalIcon,
  PanelRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Mock chat data to replicate the design
const mockChats = [
  { id: "1", title: "New chat" },
  { id: "2", title: "AI UI code prompt" },
  { id: "3", title: "ChatGPT clone doc generation" },
  { id: "4", title: "Scalable architecture flow" },
  { id: "5", title: "ChatGPT client design" },
  { id: "6", title: "Create GitHub profile page" },
  { id: "7", title: "Email/Interview answers" },
  { id: "8", title: "BACKEND CONCEPTS" },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { createChat, selectChat, currentChat } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    createChat();
  };

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
  };

  const filteredChats = mockChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white text-gray-900 transition-all duration-300 ease-in-out lg:relative lg:z-auto border-r border-gray-200",
          // Mobile behavior
          "lg:flex lg:flex-col",
          isCollapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-16" // Mobile hidden, Desktop collapsed (64px)
            : "translate-x-0 w-80 lg:w-80" // Mobile open, Desktop open (320px)
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={cn(
              "flex items-center border-b border-gray-100",
              isCollapsed ? "lg:justify-center lg:p-3" : "justify-between p-4"
            )}
          >
            {/* Desktop collapsed - only logo */}
            {isCollapsed && (
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white rounded-full border-dashed"></div>
                </div>
              </div>
            )}

            {/* Mobile and Desktop expanded */}
            {!isCollapsed && (
              <>
                <div className="flex items-center gap-3">
                  {/* OpenAI-style logo */}
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white rounded-full border-dashed"></div>
                  </div>
                  {/* Desktop expand/collapse button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="hidden lg:flex text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-8 h-8"
                  >
                    <PanelRightIcon className="h-4 w-4" />
                  </Button>
                </div>
                {/* Mobile close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="lg:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-8 h-8"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Menu Items */}
          <div
            className={cn(
              "space-y-2",
              isCollapsed ? "lg:px-2 lg:py-4" : "px-3 py-4"
            )}
          >
            {/* Desktop Collapsed - Only 3 buttons */}
            {isCollapsed && (
              <div className="hidden lg:flex lg:flex-col lg:space-y-2">
                {/* Expand Sidebar Button */}
                <Button
                  onClick={onToggle}
                  variant="ghost"
                  className="w-12 h-12 p-0 justify-center text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                  title="Expand sidebar"
                >
                  <PanelRightIcon className="h-4 w-4" />
                </Button>

                {/* New Chat */}
                <Button
                  onClick={handleNewChat}
                  variant="ghost"
                  className="w-12 h-12 p-0 justify-center text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                  title="New chat"
                >
                  <PenSquareIcon className="h-4 w-4" />
                </Button>

                {/* Search Chats */}
                <Button
                  variant="ghost"
                  className="w-12 h-12 p-0 justify-center text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                  title="Search chats"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mobile and Desktop Expanded */}
            {!isCollapsed && (
              <>
                {/* New Chat */}
                <Button
                  onClick={handleNewChat}
                  variant="ghost"
                  className="w-full justify-start h-10 px-3 text-gray-700 hover:bg-gray-200 active:bg-gray-300 font-normal"
                >
                  <PenSquareIcon className="h-4 w-4 mr-3" />
                  New chat
                </Button>

                {/* Search Chats */}
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 px-3 text-gray-700 hover:bg-gray-200 active:bg-gray-300 font-normal"
                >
                  <SearchIcon className="h-4 w-4 mr-3" />
                  Search chats
                </Button>
              </>
            )}
          </div>

          {/* Separator */}
          {!isCollapsed && (
            <div className="border-t border-gray-100 mx-3"></div>
          )}

          {/* Chats Section */}
          {!isCollapsed && (
            <div className="px-3 py-3">
              <h3 className="text-xs font-medium text-gray-500 mb-3 px-3">
                Chats
              </h3>
            </div>
          )}

          {/* Chat List */}
          <div
            className={cn(
              "flex-1 overflow-hidden",
              isCollapsed ? "lg:hidden" : "px-3" // Hide chat list completely in collapsed desktop mode
            )}
          >
            <ScrollArea className="h-full">
              <div className="space-y-1 pb-4">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "group relative rounded-lg cursor-pointer transition-all duration-200 px-3 py-2.5",
                      currentChat?.id === chat.id
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => handleChatSelect(chat.id)}
                    onMouseEnter={() => setHoveredChatId(chat.id)}
                    onMouseLeave={() => setHoveredChatId(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate font-normal">
                          {chat.title}
                        </p>
                      </div>

                      {(hoveredChatId === chat.id ||
                        currentChat?.id === chat.id) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-200 flex-shrink-0 ml-2"
                        >
                          <MoreHorizontalIcon className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div
            className={cn(
              "border-t border-gray-100",
              isCollapsed ? "lg:p-2" : "p-3"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3",
                isCollapsed ? "lg:justify-center lg:p-1 px-3 py-2" : "px-3 py-2"
              )}
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                N
              </div>
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Naman Goel
                  </div>
                  <div className="text-xs text-gray-500">Free</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Legacy component - now using mobile header instead
export function SidebarToggle({ isCollapsed, onToggle }: SidebarToggleProps) {
  return null; // Mobile header handles this now
}
