"use client";

import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatList } from "@/contexts/ChatListContext";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarFooter } from "./SidebarFooter";
import { ChatItem } from "./ChatItem";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    deleteChat,
    updateChatTitle,
  } = useChatList();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showDropdownId, setShowDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    if (newChatId) {
      // Use client-side navigation to avoid full re-render
      window.history.pushState({}, "", `/c/${newChatId}`);
      setCurrentChatId(newChatId);
    }
  };

  const handleChatSelect = (chatId: string) => {
    // Only navigate if we're not already on this chat
    const currentChatIdFromUrl = pathname.split("/c/")[1];
    if (currentChatIdFromUrl !== chatId) {
      // Use client-side navigation to avoid full re-render
      window.history.pushState({}, "", `/c/${chatId}`);
    }
    setCurrentChatId(chatId);
  };

  const handleEditStart = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
    setShowDropdownId(null);
  };

  const handleEditSave = async () => {
    if (editingChatId && editingTitle.trim()) {
      await updateChatTitle(editingChatId, editingTitle.trim());
    }
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleDeleteChat = async (chatId: string) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      await deleteChat(chatId);
      if (currentChatId === chatId) {
        // Navigate to the chat interface without a specific chat
        window.history.pushState({}, "", "/chat");
        setCurrentChatId(null);
      }
    }
    setShowDropdownId(null);
  };

  const filteredChats = chats.filter((chat) =>
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
        <div className="flex flex-col h-full justify-between">
          {!isCollapsed && <SidebarHeader onToggle={onToggle} />}

          {/* Menu Items */}
          <div
            className={cn(
              "space-y-2",
              isCollapsed ? "lg:px-2 lg:py-4" : "px-3 py-4"
            )}
          >
            <SidebarMenu
              isCollapsed={isCollapsed}
              onToggle={onToggle}
              onNewChat={handleNewChat}
            />
          </div>

          {/* Separator */}
          {!isCollapsed && <div className="border-t border-gray-100 mx-3" />}

          {/* Chats Section */}
          {!isCollapsed && (
            <div className="p-4 pb-1">
              <h3 className="text-xs font-medium text-gray-500">Chats</h3>
            </div>
          )}

          {/* Chat List */}
          {!isCollapsed && (
            <div className={cn("flex-1 overflow-hidden p-3")}>
              <ScrollArea className="h-full">
                <div className="space-y-1 pb-4">
                  {filteredChats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={currentChatId === chat.id}
                      isHovered={hoveredChatId === chat.id}
                      isEditing={editingChatId === chat.id}
                      editingTitle={editingTitle}
                      showDropdown={showDropdownId === chat.id}
                      dropdownRef={dropdownRef}
                      onSelect={handleChatSelect}
                      onHover={setHoveredChatId}
                      onEditStart={handleEditStart}
                      onEditSave={handleEditSave}
                      onEditCancel={handleEditCancel}
                      onTitleChange={setEditingTitle}
                      onDropdownToggle={(chatId) =>
                        setShowDropdownId(
                          showDropdownId === chatId ? null : chatId
                        )
                      }
                      onDelete={handleDeleteChat}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <SidebarFooter isCollapsed={isCollapsed} />
        </div>
      </div>
    </>
  );
}
