import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserChats,
  createChatInDB,
  deleteChatFromDB,
  updateChatTitle,
} from "@/lib/chat-db";

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

// export async function POST(req: Request) {
//   console.log("🚀 [CHATS API V2] Starting POST request to create new chat");

//   try {
//     console.log("🔐 [CHATS API V2] Authenticating user...");
//     const { userId } = await auth();

//     if (!userId) {
//       console.log("❌ [CHATS API V2] Authentication failed - no userId");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     console.log("📝 [CHATS API V2] Parsing request body...");

//     const { title } = await req.json();

//     console.log("✅ [CHATS API V2] Request parsed:", {
//       title: title || "No title provided",
//     });

//     console.log("🆕 [CHATS API V2] Creating new chat...");

//     const chatId = await createChatInDB(userId, title || "New Chat");

//     console.log("✅ [CHATS API V2] Chat created with ID:", chatId);

//     const responseData = {
//       id: chatId,
//       title: title || "New Chat",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     console.log("📤 [CHATS API V2] Returning created chat data");

//     return NextResponse.json(responseData);
//   } catch (error) {
//     console.error("💥 [CHATS API V2] POST Error occurred:", {
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : "No stack trace",
//       timestamp: new Date().toISOString(),
//     });
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

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
