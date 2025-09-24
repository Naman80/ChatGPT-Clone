import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserChats, createChatInDB } from "@/lib/chat-db";

export async function GET(req: Request) {
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
      chatIds: chats.map((c) => c.id),
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
    console.log(
      "✅ [CHATS API V2] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [CHATS API V2] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📝 [CHATS API V2] Parsing request body...");
    const { title } = await req.json();
    console.log("✅ [CHATS API V2] Request parsed:", {
      title: title || "No title provided",
    });

    console.log("🆕 [CHATS API V2] Creating new chat...");
    const chatId = await createChatInDB(userId, title || "New Chat");
    console.log("✅ [CHATS API V2] Chat created with ID:", chatId);

    const responseData = {
      id: chatId,
      title: title || "New Chat",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    console.log("📤 [CHATS API V2] Returning created chat data");

    return NextResponse.json(responseData);
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
