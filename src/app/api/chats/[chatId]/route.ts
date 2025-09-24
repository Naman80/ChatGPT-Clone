import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  console.log(
    "🚀 [DELETE CHAT API] Starting DELETE request for chat:",
    params.chatId
  );

  try {
    console.log("🔐 [DELETE CHAT API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [DELETE CHAT API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [DELETE CHAT API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("💾 [DELETE CHAT API] Connecting to database...");
    const client = await clientPromise;
    const db = client.db("chatgpt-clone");
    console.log("✅ [DELETE CHAT API] Database connection established");

    console.log(
      "🗑️ [DELETE CHAT API] Preparing to delete chat and messages..."
    );
    console.log("📝 [DELETE CHAT API] Chat ID:", params.chatId);
    console.log("📝 [DELETE CHAT API] User ID:", userId);

    // Delete chat and associated messages
    console.log("🔄 [DELETE CHAT API] Executing parallel delete operations...");
    const [chatDeleteResult, messagesDeleteResult] = await Promise.all([
      db.collection("chats").deleteOne({
        _id: new ObjectId(params.chatId),
        userId,
      }),
      db.collection("messages").deleteMany({
        chatId: params.chatId,
      }),
    ]);

    console.log("✅ [DELETE CHAT API] Delete operations completed:", {
      chatDeleted: chatDeleteResult.deletedCount,
      messagesDeleted: messagesDeleteResult.deletedCount,
    });

    if (chatDeleteResult.deletedCount === 0) {
      console.log(
        "⚠️ [DELETE CHAT API] No chat was deleted - either not found or not owned by user"
      );
    }

    console.log("📤 [DELETE CHAT API] Returning success response");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("💥 [DELETE CHAT API] Error occurred:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      chatId: params.chatId,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
