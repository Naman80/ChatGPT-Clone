"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { memo } from "react";

export const ChatNotFound = memo(() => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
      <h1 className="text-3xl font-normal text-gray-900 leading-tight">
        Chat not found
      </h1>
      <Link href="/">
        <Button>Start a new chat</Button>
      </Link>
    </div>
  );
});

ChatNotFound.displayName = "ChatNotFound";
