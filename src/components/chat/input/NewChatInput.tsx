"use client";

import React, { useState, useRef, useEffect } from "react";
import { PlusCircle, MicIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewChatInputProps {
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

export function NewChatInput({
  onSubmit,
  isLoading,
  disabled = false,
}: NewChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea with fixed max height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 120;
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [message]);

  // Focus on textarea when component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;

    const messageToSend = message.trim();
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await onSubmit(messageToSend);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessage(messageToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full px-4 py-3">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-lg flex items-center p-3 gap-3 max-w-4xl mx-auto">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0 w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600"
            disabled={disabled}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>

          <div className="flex-1 min-h-[40px] max-h-[120px] overflow-hidden flex items-center">
            <textarea
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

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600"
              disabled={disabled}
            >
              <MicIcon className="h-5 w-5" />
            </Button>

            {message.trim() && (
              <Button
                type="submit"
                disabled={isLoading || !message.trim() || disabled}
                className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 text-white p-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUpIcon className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
