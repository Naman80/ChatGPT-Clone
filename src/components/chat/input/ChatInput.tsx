"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  useMemo,
} from "react";
import { MicIcon, ArrowUpIcon, X, Edit2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureDropdown } from "./FeatureDropdown";
import Image from "next/image";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

interface FilePreview {
  id: string;
  file: File;
  url?: string;
  type?: string;
}

export const ChatInput = memo(
  ({ onSubmit, isLoading, disabled = false }: ChatInputProps) => {
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<FilePreview[]>([]);
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

    // Handle file selection from FeatureDropdown
    const handleFileSelect = useCallback((selectedFiles: FileList) => {
      const newFiles: FilePreview[] = Array.from(selectedFiles).map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        type: file.type.startsWith("image/")
          ? "image"
          : file.name.split(".").pop() || "",
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    // Handle file removal
    const handleRemoveFile = useCallback((id: string) => {
      setFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === id);
        if (fileToRemove?.url) {
          URL.revokeObjectURL(fileToRemove.url);
        }
        return prev.filter((f) => f.id !== id);
      });
    }, []);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading || disabled) return;

        const messageToSend = message.trim();
        setMessage("");
        setFiles((prev) => {
          prev.forEach((f) => f.url && URL.revokeObjectURL(f.url));
          return [];
        });

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

    const filesComponent = useMemo(() => {
      return files.map((file) => {
        return (
          <div key={file.id} className="relative h-16 flex-shrink-0">
            {file.type === "image" && file.url ? (
              <Image
                width={70}
                height={70}
                src={file.url}
                alt={file.file.name}
                className="h-full object-cover rounded-md"
              />
            ) : (
              <div className="relative w-full h-full border border-gray-200 rounded-2xl flex items-center justify-center gap-2 p-2">
                <div className="flex items-center justify-center rounded-lg h-10 w-10 shrink-0 bg-red-500">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="max-w-[250px] flex flex-col">
                  <p className="text-sm text-gray-600 truncate w-full text-center">
                    {file.file.name}
                  </p>
                  {file.type && (
                    <p className="text-sm text-gray-600">{file.type}</p>
                  )}
                </div>
              </div>
            )}
            <div className="absolute top-1 right-1 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-5 h-5 bg-black rounded-full p-0 hover:bg-opacity-70"
                onClick={() => handleRemoveFile(file.id)}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        );
      });
    }, [files, handleRemoveFile]);

    return (
      <div className="w-full bg-white p-5">
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className={`bg-white border border-gray-200 shadow-lg flex flex-col p-2 gap-2 max-w-4xl mx-auto
              ${files.length > 0 ? "rounded-4xl" : "rounded-full"}
              `}
          >
            {/* File Preview Area */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 max-h-[100px] overflow-y-scroll">
                {filesComponent}
              </div>
            )}

            {/*  TEXT AREA */}
            <div className="flex items-end gap-2">
              <FeatureDropdown onFileSelect={handleFileSelect} />
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
          </div>
        </form>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
