"use client";

import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { ChatItem as ChatItemType } from "@/contexts/ChatListContext";
import { ChatEditMode } from "./ChatEditMode";
import Link from "next/link";
import { ChatDropdown } from "./ChatDropdown";

interface ChatItemProps {
  chat: ChatItemType;
  isActive: boolean;
  isEditing: boolean;
  editingTitle: string;
  onEditStart: (chatId: string, title: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onTitleChange: (title: string) => void;
  onDelete: (chatId: string) => void;
}

export const ChatItem = memo(
  ({
    chat,
    isActive,
    isEditing,
    editingTitle,
    onEditStart,
    onEditSave,
    onEditCancel,
    onTitleChange,
    onDelete,
  }: ChatItemProps) => {
    return (
      <Link
        href={`/c/${chat.chatId}`}
        className={cn(
          "group relative rounded-lg transition-all duration-200 px-3 py-2.5 flex items-center justify-between",
          isActive ? "bg-gray-200" : "hover:bg-gray-100 cursor-pointer"
        )}
      >
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <ChatEditMode
              title={editingTitle}
              onTitleChange={onTitleChange}
              onSave={onEditSave}
              onCancel={onEditCancel}
            />
          ) : (
            <span className="text-sm text-gray-900 truncate font-normal">
              {chat.title}
            </span>
          )}
        </div>

        {!isEditing && (
          <ChatDropdown
            chatId={chat.chatId}
            chatTitle={chat.title}
            onEdit={onEditStart}
            onDelete={onDelete}
          />
        )}
      </Link>
    );
  }
);

ChatItem.displayName = "ChatItem";
