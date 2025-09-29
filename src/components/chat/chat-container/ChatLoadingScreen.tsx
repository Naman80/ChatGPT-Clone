import { memo } from "react";

export const ChatLoadingScreen = memo(() => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Loading text */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Loading conversation messages
          <span className="animate-pulse">...</span>
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          Please wait while we fetch your messages
        </p>

        {/* Simple animated dots */}
        <div className="flex justify-center space-x-1 mt-6">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: "1s",
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
});

ChatLoadingScreen.displayName = "ChatLoadingScreen";
