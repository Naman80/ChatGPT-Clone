import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserChats,
  createChatInDB,
  deleteChatFromDB,
  saveChatMessages,
} from "@/lib/chat-db";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { getCurrentModel, getLLMService } from "@/lib/llm";

export async function GET() {
  console.log("🚀 [CHATS API V2] Starting GET request to fetch all chats");

  try {
    console.log("🔐 [CHATS API V2] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [CHATS API V2] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [CHATS API V2] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 [CHATS API V2] Querying chats for user:", userId);

    const chats = await getUserChats(userId);

    console.log("✅ [CHATS API V2] Found chats:", {
      count: chats.length,
      chatIds: chats.map((c) => c.chatId),
    });

    console.log("📤 [CHATS API V2] Returning chats");
    return NextResponse.json(chats);
  } catch (error) {
    console.error("💥 [CHATS API V2] GET Error occurred:", {
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

export async function POST(req: Request) {
  console.log("🚀 [CHATS API V2] Starting POST request to create new chat");

  try {
    console.log("🔐 [CHATS API V2] Authenticating user...");
    const { userId } = await auth();

    if (!userId) {
      console.log("❌ [CHATS API V2] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🆕 [CHATS API V2] Creating new chat...");

    const { messages, id: chatId }: { messages: UIMessage[]; id: string } =
      await req.json();

    // create new chat in db
    await createChatInDB(userId, chatId, "New Chat");

    console.log("✅ [CHATS API V2] Chat created with ID:", chatId, req);

    console.log(messages, "new chat msge");

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

    console.log("✅ [CHAT API V2] LLM stream created successfully", result);

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
