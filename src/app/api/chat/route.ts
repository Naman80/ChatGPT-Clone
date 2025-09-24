import { streamText, convertToModelMessages, UIMessage } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCurrentModel, getLLMService } from "@/lib/llm";
import { saveChatMessages, chatExists, createChatInDB } from "@/lib/chat-db";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("🚀 [CHAT API V2] Starting POST request");

  try {
    console.log("🔐 [CHAT API V2] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [CHAT API V2] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [CHAT API V2] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for chatId in URL query parameters (sent by AI SDK useChat hook)
    const url = new URL(req.url);
    const chatIdFromQuery = url.searchParams.get("chatId");

    console.log("📝 [CHAT API V2] Parsing request body...");
    const {
      messages,
      chatId: chatIdFromBody,
    }: { messages: UIMessage[]; chatId?: string } = await req.json();

    // Use chatId from query parameters first, then from body
    const chatId = chatIdFromQuery || chatIdFromBody;

    console.log("✅ [CHAT API V2] Request parsed:", {
      messagesCount: messages?.length || 0,
      chatIdFromQuery: chatIdFromQuery || "No chatId from query",
      chatIdFromBody: chatIdFromBody || "No chatId from body",
      finalChatId: chatId || "No chatId",
      lastMessage:
        messages?.length > 0 ? "Last message received" : "No messages",
    });

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      console.log("❌ [CHAT API V2] Invalid messages array");
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Create new chat if no chatId provided
    let finalChatId = chatId;
    if (!finalChatId) {
      console.log("🆕 [CHAT API V2] Creating new chat...");
      finalChatId = await createChatInDB(userId, "New Chat");
      console.log("✅ [CHAT API V2] New chat created:", finalChatId);
    } else {
      // Verify chat exists and belongs to user
      const exists = await chatExists(finalChatId, userId);
      if (!exists) {
        console.log("❌ [CHAT API V2] Chat not found or access denied");
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    }

    console.log("🤖 [CHAT API V2] Preparing LLM request...");

    // Get LLM service and validate
    const llmService = getLLMService();
    const validation = await llmService.validateProvider();

    if (!validation.valid) {
      console.log(
        "❌ [CHAT API V2] LLM provider validation failed:",
        validation.error
      );
      return NextResponse.json(
        { error: "LLM provider not configured" },
        { status: 500 }
      );
    }

    const model = getCurrentModel();
    const config = llmService.getConfig();

    console.log("📝 [CHAT API V2] LLM Configuration:", {
      provider: config.provider,
      model: config.model,
      messageCount: messages?.length || 0,
    });

    // Convert UI messages to model messages for the LLM
    const modelMessages = convertToModelMessages(messages);
    console.log("✅ [CHAT API V2] Messages converted for LLM:", {
      messageCount: modelMessages?.length || 0,
    });

    // Stream response from LLM
    console.log("🔄 [CHAT API V2] Calling LLM streamText...");
    const result = await streamText({
      model,
      messages: modelMessages,
    });
    console.log("✅ [CHAT API V2] LLM stream created successfully");

    console.log(
      "📤 [CHAT API V2] Returning streaming response with persistence"
    );
    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: finalMessages }) => {
        try {
          console.log("💾 [CHAT API V2] Saving messages to database...");
          await saveChatMessages(finalChatId!, userId, finalMessages);
          console.log("✅ [CHAT API V2] Messages saved successfully");
        } catch (error) {
          console.error("💥 [CHAT API V2] Failed to save messages:", error);
          // Don't throw here to avoid breaking the stream
        }
      },
    });
  } catch (error) {
    console.error("💥 [CHAT API V2] Error occurred:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
