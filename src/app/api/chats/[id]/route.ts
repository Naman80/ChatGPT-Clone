import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { chatExists, loadChatFromDB, saveChatMessages } from "@/lib/chat-db";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { getCurrentModel, getLLMService } from "@/lib/llm";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  console.log("🚀 [CHAT LOAD API] Starting GET request");

  try {
    console.log("🔐 [CHAT LOAD API] Authenticating user...");
    const { userId } = await auth();

    if (!userId) {
      console.log("❌ [CHAT LOAD API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await props.params;

    console.log("📋 [CHAT LOAD API] Loading chat:", chatId);

    if (!chatId) {
      console.log("❌ [CHAT LOAD API] No chat ID provided");
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    try {
      const messages = await loadChatFromDB(chatId, userId);

      console.log("✅ [CHAT LOAD API] Chat loaded successfully:", {
        chatId,
        messageCount: messages.length,
      });

      return NextResponse.json({ messages });
    } catch (error) {
      if (error instanceof Error && error.message === "Chat not found") {
        console.log("❌ [CHAT LOAD API] Chat not found:", chatId);
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("💥 [CHAT LOAD API] Error occurred:", {
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

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  console.log("🚀 [CHATS API V2] Starting POST request to existing chat");

  try {
    console.log("🔐 [CHATS API V2] Authenticating user...");
    const { userId } = await auth();

    if (!userId) {
      console.log("❌ [CHATS API V2] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await props.params;

    const doesChatExist = await chatExists(chatId, userId);

    if (!doesChatExist) {
      console.log("❌ [CHATS API V2] Chat does not exist");
      return NextResponse.json(
        { error: "Chat does not exist" },
        { status: 404 }
      );
    }

    console.log("🆕 [CHATS API V2] Updating existing chat...");

    const { messages }: { messages: UIMessage[] } = await req.json();

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      console.log("❌ [CHAT API V2] Invalid messages array");
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
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

    // Convert UI messages to model messages for the LLM
    const modelMessages = convertToModelMessages(messages);
    console.log("✅ [CHAT API V2] Messages converted for LLM:", {
      messageCount: modelMessages?.length || 0,
    });

    // Stream response from LLM
    console.log("🔄 [CHAT API V2] Calling LLM streamText...");

    const result = streamText({
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
          await saveChatMessages(chatId, userId, finalMessages);
          console.log("✅ [CHAT API V2] Messages saved successfully");
        } catch (error) {
          console.error("💥 [CHAT API V2] Failed to save messages:", error);
          // Don't throw here to avoid breaking the stream
        }
      },
    });
  } catch (error) {
    console.error("💥 [CHATS API V2] POST Error occurred:", {
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
