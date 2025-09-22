"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendIcon, PlusCircle, MicIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

export function ChatInput() {
  const { sendMessage, isLoading } = useChat();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea with fixed max height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 120; // Fixed max height for scrolling
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [message]);

  // Focus on textarea when component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await sendMessage(messageToSend);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="w-full px-4 py-3">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-lg flex items-center p-3 gap-3 max-w-4xl mx-auto">
          {/* Plus button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0 w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>

          {/* Text input area */}
          <div className="flex-1 min-h-[40px] max-h-[120px] overflow-hidden flex items-center">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              className="w-full resize-none border-0 outline-none text-base leading-6 placeholder-gray-500 bg-transparent min-h-[24px] py-2"
              rows={1}
              disabled={isLoading}
            />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Microphone button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 flex items-center justify-center"
            >
              <MicIcon className="h-5 w-5" />
            </Button>

            {/* Send button */}
            {message.trim() && (
              <Button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 text-white p-0 flex items-center justify-center"
              >
                <ArrowUpIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
