"use client";

import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, EditIcon, TrashIcon } from "lucide-react";

interface ChatDropdownProps {
  chatId: string;
  chatTitle: string;
  onEdit: (chatId: string, title: string) => void;
  onDelete: (chatId: string) => void;
}

export const ChatDropdown = memo(
  ({ chatId, chatTitle, onEdit, onDelete }: ChatDropdownProps) => {
    const onTriggerClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const onRename = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(chatId, chatTitle);
      },
      [chatId, chatTitle, onEdit]
    );

    const onDeleteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(chatId);
      },
      [chatId, onDelete]
    );
    return (
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-200 flex-shrink-0 ml-2"
              onClick={onTriggerClick}
              aria-label="Chat options"
            >
              <MoreHorizontalIcon className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-white border-gray-200 min-w-[120px]"
            align="end"
            alignOffset={10}
          >
            <DropdownMenuItem
              className="text-sm text-gray-900 hover:bg-gray-200 flex items-center gap-2"
              onClick={onRename}
            >
              <EditIcon className="h-3 w-3" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              onClick={onDeleteClick}
            >
              <TrashIcon className="h-3 w-3" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

ChatDropdown.displayName = "ChatDropdown";
