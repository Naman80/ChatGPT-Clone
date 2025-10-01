"use client";

import React, { memo, useCallback, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatList } from "@/contexts/ChatListContext";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarFooter } from "./SidebarFooter";
import { ChatItem } from "./ChatItem";
import { useParams } from "next/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = memo(({ isCollapsed, onToggle }: SidebarProps) => {
  const { chatId: currentChatId } = useParams();

  const { chats, updateChatTitle, deleteChat } = useChatList();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleEditStart = useCallback(
    (chatId: string, currentTitle: string) => {
      setEditingChatId(chatId);
      setEditingTitle(currentTitle);
    },
    []
  );

  const handleEditSave = useCallback(async () => {
    if (editingChatId && editingTitle.trim()) {
      await updateChatTitle(editingChatId, editingTitle.trim());
    }
    setEditingChatId(null);
    setEditingTitle("");
  }, [editingChatId, updateChatTitle, editingTitle]);

  const handleEditCancel = useCallback(() => {
    setEditingChatId(null);
    setEditingTitle("");
  }, []);

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      if (chatId && chatId.trim()) {
        await deleteChat(chatId);
      }
    },
    [deleteChat]
  );

  const filteredChats = useMemo(
    () =>
      chats.filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [chats, searchQuery]
  );

  const chatItems = useMemo(
    () =>
      filteredChats.map((chat) => (
        <ChatItem
          key={chat.chatId}
          chat={chat}
          isActive={chat.chatId === currentChatId}
          isEditing={chat.chatId === editingChatId}
          editingTitle={editingTitle}
          onEditStart={handleEditStart}
          onEditSave={handleEditSave}
          onEditCancel={handleEditCancel}
          onTitleChange={setEditingTitle}
          onDelete={handleDeleteChat}
        />
      )),
    [
      filteredChats,
      currentChatId,
      editingChatId,
      editingTitle,
      handleEditStart,
      handleEditSave,
      handleEditCancel,
      handleDeleteChat,
      setEditingTitle,
    ]
  );

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-[#f9f9f9] text-gray-900 transition-all duration-200 ease-in-out md:relative md:z-auto border-r border-gray-200",
          // Mobile behavior
          "md:flex md:flex-col",
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-[56px] bg-[#ffffff]" // Mobile hidden, Desktop collapsed (64px)
            : "translate-x-0 w-65 md:w-[260px]" // Mobile open, Desktop open (320px)
        )}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col ">
            {<SidebarHeader onToggle={onToggle} isCollapsed={isCollapsed} />}

            {/* Menu Items */}

            <SidebarMenu isCollapsed={isCollapsed} />

            {/* Separator */}
            {/* {<div className="border-t border-gray-100 mx-3" />} */}

            {/* Chats Section */}
            {!isCollapsed && (
              <div className="p-1.5 pb-0">
                <h3 className="text-sm font-medium text-[#8e8e8e] px-2.5 py-1.5 pb-0">
                  Chats
                </h3>
              </div>
            )}

            {/* Chat List */}
            {!isCollapsed && (
              <div className={cn("flex-1 overflow-hidden p-1.5")}>
                <ScrollArea className="h-full">
                  <div className="flex flex-col">{chatItems}</div>
                </ScrollArea>
              </div>
            )}
          </div>

          <SidebarFooter isCollapsed={isCollapsed} />
        </div>
      </div>
    </>
  );
});

Sidebar.displayName = "Sidebar";
