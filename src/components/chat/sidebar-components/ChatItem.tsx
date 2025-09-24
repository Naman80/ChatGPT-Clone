"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatItem as ChatItemType } from "@/contexts/ChatListContext";
import { ChatEditMode } from "./ChatEditMode";
import { ChatDropdown } from "./ChatDropdown";

interface ChatItemProps {
  chat: ChatItemType;
  isActive: boolean;
  isHovered: boolean;
  isEditing: boolean;
  editingTitle: string;
  showDropdown: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (chatId: string) => void;
  onHover: (chatId: string | null) => void;
  onEditStart: (chatId: string, title: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onTitleChange: (title: string) => void;
  onDropdownToggle: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

export function ChatItem({
  chat,
  isActive,
  isHovered,
  isEditing,
  editingTitle,
  showDropdown,
  dropdownRef,
  onSelect,
  onHover,
  onEditStart,
  onEditSave,
  onEditCancel,
  onTitleChange,
  onDropdownToggle,
  onDelete,
}: ChatItemProps) {
  return (
    <div
      className={cn(
        "group relative rounded-lg transition-all duration-200 px-3 py-2.5",
        isActive ? "bg-gray-200" : "hover:bg-gray-100 cursor-pointer"
      )}
      onClick={() => !isEditing && onSelect(chat.id)}
      onMouseEnter={() => onHover(chat.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <ChatEditMode
              title={editingTitle}
              onTitleChange={onTitleChange}
              onSave={onEditSave}
              onCancel={onEditCancel}
            />
          ) : (
            <p className="text-sm text-gray-900 truncate font-normal">
              {chat.title}
            </p>
          )}
        </div>

        {!isEditing && (isHovered || isActive) && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-200 flex-shrink-0 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                onDropdownToggle(chat.id);
              }}
            >
              <MoreHorizontalIcon className="h-3 w-3" />
            </Button>

            {showDropdown && (
              <div ref={dropdownRef}>
                <ChatDropdown
                  chatId={chat.id}
                  chatTitle={chat.title}
                  onEdit={onEditStart}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
