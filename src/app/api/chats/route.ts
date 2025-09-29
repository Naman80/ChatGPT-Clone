import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserChats,
  createChatInDB,
  deleteChatFromDB,
  updateChatTitle,
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

    const chatId = await createChatInDB(userId, "New Chat");

    console.log("✅ [CHATS API V2] Chat created with ID:", chatId);

    const { messages }: { messages: UIMessage[] } = await req.json();

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

export async function PUT(req: Request) {
  console.log("🚀 [CHAT UPDATE API] Starting PUT request");

  try {
    console.log("🔐 [CHAT UPDATE API] Authenticating user...");
    const { userId } = await auth();

    if (!userId) {
      console.log("❌ [CHAT UPDATE API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, title } = await req.json();
    console.log("📝 [CHAT UPDATE API] Updating chat:", chatId);

    if (!chatId) {
      console.log("❌ [CHAT UPDATE API] No chat ID provided");
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    console.log("📝 [CHAT UPDATE API] New title:", title);

    if (!title || typeof title !== "string") {
      console.log("❌ [CHAT UPDATE API] Invalid title provided");
      return NextResponse.json(
        { error: "Valid title required" },
        { status: 400 }
      );
    }

    try {
      await updateChatTitle(chatId, userId, title);
      console.log(
        "✅ [CHAT UPDATE API] Chat title updated successfully:",
        chatId
      );

      return NextResponse.json({ success: true, title });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Chat not found or access denied"
      ) {
        console.log(
          "❌ [CHAT UPDATE API] Chat not found or access denied:",
          chatId
        );
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("💥 [CHAT UPDATE API] Error occurred:", {
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

export async function DELETE(req: Request) {
  console.log("🚀 [CHAT DELETE API] Starting DELETE request");

  try {
    console.log("🔐 [CHAT DELETE API] Authenticating user...");
    const { userId } = await auth();

    if (!userId) {
      console.log("❌ [CHAT DELETE API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await req.json();
    console.log("🗑️ [CHAT DELETE API] Deleting chat:", chatId);

    if (!chatId) {
      console.log("❌ [CHAT DELETE API] No chat ID provided");
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    try {
      await deleteChatFromDB(chatId, userId);
      console.log("✅ [CHAT DELETE API] Chat deleted successfully:", chatId);

      return NextResponse.json({ success: true });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Chat not found or access denied"
      ) {
        console.log(
          "❌ [CHAT DELETE API] Chat not found or access denied:",
          chatId
        );
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    }
  } catch (error) {
    console.error("💥 [CHAT DELETE API] Error occurred:", {
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
