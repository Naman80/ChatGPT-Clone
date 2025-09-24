import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentModel, getLLMService } from "@/lib/llm";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("🚀 [CHAT API] Starting POST request");

  try {
    console.log("🔐 [CHAT API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [CHAT API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [CHAT API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📝 [CHAT API] Parsing request body...");
    const { messages, chatId } = await req.json();
    console.log("✅ [CHAT API] Request parsed:", {
      messagesCount: messages?.length || 0,
      chatId: chatId || "No chatId",
      lastMessage:
        messages?.[messages.length - 1]?.content?.substring(0, 50) + "..." ||
        "No messages",
    });

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      console.log("❌ [CHAT API] Invalid messages array");
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Save user message to database if chatId exists
    if (chatId && messages.length > 0) {
      console.log("💾 [CHAT API] Saving user message to database...");
      const client = await clientPromise;
      const db = client.db("chatgpt-clone");
      console.log("✅ [CHAT API] Database connection established");

      const userMessage = messages[messages.length - 1];
      if (userMessage.role === "user") {
        console.log("💾 [CHAT API] Inserting user message:", {
          chatId,
          userId,
          content: userMessage.content.substring(0, 100) + "...",
          role: userMessage.role,
        });

        const insertResult = await db.collection("messages").insertOne({
          chatId,
          userId,
          content: userMessage.content,
          role: userMessage.role,
          timestamp: new Date(),
        });

        console.log(
          "✅ [CHAT API] User message saved with ID:",
          insertResult.insertedId
        );
      } else {
        console.log("⏭️ [CHAT API] Skipping message save - not a user message");
      }
    } else {
      console.log(
        "⏭️ [CHAT API] Skipping database save - no chatId or messages"
      );
    }

    console.log("🤖 [CHAT API] Preparing LLM request...");

    // Get LLM service and validate
    const llmService = getLLMService();
    const validation = await llmService.validateProvider();

    if (!validation.valid) {
      console.log(
        "❌ [CHAT API] LLM provider validation failed:",
        validation.error
      );
      return NextResponse.json(
        { error: "LLM provider not configured" },
        { status: 500 }
      );
    }

    const model = getCurrentModel();
    const config = llmService.getConfig();

    console.log("📝 [CHAT API] LLM Configuration:", {
      provider: config.provider,
      model: config.model,
      messageCount: messages?.length || 0,
    });

    console.log("📝 [CHAT API] Raw messages:", messages);

    console.log("✅ [CHAT API] Messages formatted for LLM:", {
      messageCount: messages?.length || 0,
    });

    // Stream response from LLM
    console.log("🔄 [CHAT API] Calling LLM streamText...");
    const result = await streamText({
      model,
      messages: messages || [],
    });
    console.log("✅ [CHAT API] LLM stream created successfully");

    console.log("📤 [CHAT API] Returning streaming response");
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("💥 [CHAT API] Error occurred:", {
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
