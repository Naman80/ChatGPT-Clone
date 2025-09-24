import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  loadChatFromDB,
  deleteChatFromDB,
  updateChatTitle,
} from "@/lib/chat-db";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  console.log("🚀 [CHAT LOAD API] Starting GET request");

  try {
    console.log("🔐 [CHAT LOAD API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [CHAT LOAD API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

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

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  console.log("🚀 [CHAT UPDATE API] Starting PUT request");

  try {
    console.log("🔐 [CHAT UPDATE API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [CHAT UPDATE API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [CHAT UPDATE API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await props.params;
    console.log("📝 [CHAT UPDATE API] Updating chat:", chatId);

    if (!chatId) {
      console.log("❌ [CHAT UPDATE API] No chat ID provided");
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    const { title } = await req.json();
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

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  console.log("🚀 [CHAT DELETE API] Starting DELETE request");

  try {
    console.log("🔐 [CHAT DELETE API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [CHAT DELETE API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [CHAT DELETE API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await props.params;
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
      throw error;
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
