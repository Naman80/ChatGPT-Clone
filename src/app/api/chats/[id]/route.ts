import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { loadChatFromDB } from "@/lib/chat-db";

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
