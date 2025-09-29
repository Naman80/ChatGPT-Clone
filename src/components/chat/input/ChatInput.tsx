"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { PlusCircle, MicIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  // onSubmit: (message: string) => Promise<void>;
  onSubmit: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = memo(
  ({ onSubmit, isLoading, disabled = false }: ChatInputProps) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea with fixed max height
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const maxHeight = 120;
        textarea.style.height = `${Math.min(
          textarea.scrollHeight,
          maxHeight
        )}px`;
      }
    }, [message]);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading || disabled) return;

        const messageToSend = message.trim();
        setMessage("");

        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }

        try {
          onSubmit(messageToSend);
        } catch (error) {
          console.error("Failed to send message:", error);
          setMessage(messageToSend);
        }
      },
      [isLoading, disabled, message, onSubmit]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      },
      [handleSubmit]
    );

    return (
      <div className="w-full bg-white p-4 ">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-lg flex items-end p-2 gap-2 max-w-4xl mx-auto">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0 w-10 h-10 rounded-full hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>

            <div className="flex-1 min-h-[40px] max-h-[120px] overflow-hidden flex items-center">
              <textarea
                autoFocus
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything"
                className="w-full resize-none border-0 outline-none text-base leading-6 placeholder-gray-500 bg-transparent min-h-[24px] py-2 text-black caret-black"
                rows={1}
                disabled={isLoading || disabled}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-gray-600 flex-shrink-0 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            >
              <MicIcon className="h-5 w-5" />
            </Button>

            {message.trim() && (
              <Button
                type="submit"
                disabled={isLoading || !message.trim() || disabled}
                className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 text-white p-0 disabled:opacity-50 flex-shrink-0"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUpIcon className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
