import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("🚀 [MESSAGES API] Starting POST request to save message");

  try {
    console.log("🔐 [MESSAGES API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [MESSAGES API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [MESSAGES API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📝 [MESSAGES API] Parsing request body...");
    const { chatId, content, role } = await req.json();
    console.log("✅ [MESSAGES API] Request parsed:", {
      chatId: chatId || "No chatId",
      role: role || "No role",
      contentLength: content?.length || 0,
      contentPreview: content?.substring(0, 100) + "..." || "No content",
    });

    console.log("💾 [MESSAGES API] Connecting to database...");
    const client = await clientPromise;
    const db = client.db("chatgpt-clone");
    console.log("✅ [MESSAGES API] Database connection established");

    const message = {
      chatId,
      userId,
      content,
      role,
      timestamp: new Date(),
    };
    console.log("💾 [MESSAGES API] Inserting message:", {
      chatId,
      userId,
      role,
      timestamp: message.timestamp.toISOString(),
    });

    const insertResult = await db.collection("messages").insertOne(message);
    console.log(
      "✅ [MESSAGES API] Message saved with ID:",
      insertResult.insertedId.toString()
    );

    // Update chat's updatedAt timestamp
    console.log("🔄 [MESSAGES API] Updating chat timestamp...");
    const updateResult = await db
      .collection("chats")
      .updateOne({ _id: chatId, userId }, { $set: { updatedAt: new Date() } });
    console.log("✅ [MESSAGES API] Chat timestamp updated:", {
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });

    console.log("📤 [MESSAGES API] Returning success response");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 [MESSAGES API] POST Error occurred:", {
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

export async function GET(req: Request) {
  console.log("🚀 [MESSAGES API] Starting GET request to fetch messages");

  try {
    console.log("🔐 [MESSAGES API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [MESSAGES API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [MESSAGES API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 [MESSAGES API] Extracting chatId from URL...");
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    console.log(
      "✅ [MESSAGES API] ChatId extracted:",
      chatId || "No chatId provided"
    );

    if (!chatId) {
      console.log("❌ [MESSAGES API] No chatId provided in request");
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    console.log("💾 [MESSAGES API] Connecting to database...");
    const client = await clientPromise;
    const db = client.db("chatgpt-clone");
    console.log("✅ [MESSAGES API] Database connection established");

    console.log("🔍 [MESSAGES API] Querying messages for chat:", chatId);
    const messages = await db
      .collection("messages")
      .find({ chatId, userId })
      .sort({ timestamp: 1 })
      .toArray();
    console.log("✅ [MESSAGES API] Found messages:", {
      count: messages.length,
      messageIds: messages.map((m) => m._id.toString()),
    });

    console.log("🔄 [MESSAGES API] Formatting message data...");
    const formattedMessages = messages.map((msg) => ({
      id: msg._id.toString(),
      content: msg.content,
      role: msg.role,
      timestamp: msg.timestamp,
    }));
    console.log("✅ [MESSAGES API] Messages formatted successfully");

    console.log("📤 [MESSAGES API] Returning formatted messages");
    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("💥 [MESSAGES API] GET Error occurred:", {
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
