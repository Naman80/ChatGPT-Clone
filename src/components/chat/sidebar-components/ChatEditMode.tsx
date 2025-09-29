"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, XIcon } from "lucide-react";

interface ChatEditModeProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ChatEditMode({
  title,
  onTitleChange,
  onSave,
  onCancel,
}: ChatEditModeProps) {
  return (
    <div
      className="flex items-center gap-2 "
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-sm h-7 px-2 bg-transparent outline-none border-none"
        autoFocus
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSave();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100"
        onClick={onSave}
      >
        <CheckIcon className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
        onClick={onCancel}
      >
        <XIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}
