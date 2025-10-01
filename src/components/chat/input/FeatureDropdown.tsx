"use client";

import React, { memo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Paperclip } from "lucide-react";

interface FeatureDropdownProps {
  onFileSelect: (file: FileList) => void;
}

export const FeatureDropdown = memo(
  ({ onFileSelect }: FeatureDropdownProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onTriggerClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const onAddFilesClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, []);

    const onFileSelectDirect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          // Handle selected files here
          console.log("Selected files:", files);

          const file = files[0];
          console.log("Selected file:", file);
          const fileURL = URL.createObjectURL(file);
          console.log("File URL:", fileURL);

          onFileSelect(files);

          // You can add your file handling logic here, e.g., uploading or processing files
        }
      },
      []
    );

    return (
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelectDirect}
          className="hidden"
          multiple
          accept="image/*,.pdf,.doc,.docx"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Input options"
              onClick={onTriggerClick}
              className="flex-shrink-0 w-10 h-10 rounded-full hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-white border-gray-200 min-w-[120px]"
            align="start"
            alignOffset={3}
            sideOffset={-5}
          >
            <DropdownMenuItem
              className="text-sm text-gray-900! hover:bg-gray-200! focus:bg-gray-200! flex items-center gap-2"
              onClick={onAddFilesClick}
            >
              <Paperclip className="h-3 w-3" />
              Add photos and files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

FeatureDropdown.displayName = "FeatureDropdown";
