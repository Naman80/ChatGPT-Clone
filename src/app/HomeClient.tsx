"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat";
import { ChatProvider } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import {
  MenuIcon,
  Sparkles,
  MoreVertical,
  ChevronDownIcon,
} from "lucide-react";
import { Sidebar } from "@/components/chat/Sidebar";

interface SerializedUser {
  id: string;
  firstName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
}

interface HomeClientProps {
  user: SerializedUser | null;
}

export function HomeClient({ user }: HomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ChatProvider>
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={!isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex lg:items-center lg:justify-between lg:px-6 lg:h-14 lg:border-b lg:border-gray-200 lg:flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">
                ChatGPT
              </span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Welcome,{" "}
                  {user.firstName || user.emailAddresses[0]?.emailAddress}
                </span>
              )}
            </div>
          </header>

          {/* Mobile Header */}
          <header className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>

            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Go
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Center content - Mobile */}
            <div className="flex-1 flex items-center justify-center px-6 lg:hidden">
              <div className="text-center">
                <h1 className="text-3xl font-normal text-gray-900 leading-tight">
                  What&apos;s on the agenda today?
                </h1>
              </div>
            </div>

            {/* Center content - Desktop */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-normal text-gray-900 leading-tight">
                  What&apos;s on the agenda today?
                </h1>
              </div>
            </div>

            {/* Sticky input at bottom - Mobile */}
            <div className="flex-shrink-0 p-4 pb-6 lg:hidden">
              <ChatInput />
            </div>

            {/* Desktop input */}
            <div className="hidden lg:block lg:flex-shrink-0 lg:p-6">
              <ChatInput />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
