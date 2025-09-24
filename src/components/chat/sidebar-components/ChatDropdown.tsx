"use client";

import React from "react";
import { EditIcon, TrashIcon } from "lucide-react";

interface ChatDropdownProps {
  chatId: string;
  chatTitle: string;
  onEdit: (chatId: string, title: string) => void;
  onDelete: (chatId: string) => void;
}

export function ChatDropdown({
  chatId,
  chatTitle,
  onEdit,
  onDelete,
}: ChatDropdownProps) {
  return (
    <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
      <button
        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(chatId, chatTitle);
        }}
      >
        <EditIcon className="h-3 w-3" />
        Rename
      </button>
      <button
        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(chatId);
        }}
      >
        <TrashIcon className="h-3 w-3" />
        Delete
      </button>
    </div>
  );
}
