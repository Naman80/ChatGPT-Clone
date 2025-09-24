import { auth } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("🚀 [CHATS API] Starting GET request to fetch all chats");

  try {
    console.log("🔐 [CHATS API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [CHATS API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [CHATS API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("💾 [CHATS API] Connecting to database...");
    const client = await clientPromise;
    const db = client.db("chatgpt-clone");
    console.log("✅ [CHATS API] Database connection established");

    console.log("🔍 [CHATS API] Querying chats for user:", userId);
    const chats = await db
      .collection("chats")
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    console.log("✅ [CHATS API] Found chats:", {
      count: chats.length,
      chatIds: chats.map((c) => c._id.toString()),
    });

    // Convert MongoDB _id to id and format dates
    console.log("🔄 [CHATS API] Formatting chat data...");
    const formattedChats = chats.map((chat) => ({
      id: chat._id.toString(),
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messages: [], // Messages will be loaded separately
    }));
    console.log("✅ [CHATS API] Chats formatted successfully");

    console.log("📤 [CHATS API] Returning formatted chats");
    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("💥 [CHATS API] GET Error occurred:", {
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
  console.log("🚀 [CHATS API] Starting POST request to create new chat");

  try {
    console.log("🔐 [CHATS API] Authenticating user...");
    const { userId } = await auth();
    console.log(
      "✅ [CHATS API] User authenticated:",
      userId ? `User ID: ${userId}` : "No user ID"
    );

    if (!userId) {
      console.log("❌ [CHATS API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📝 [CHATS API] Parsing request body...");
    const { title } = await req.json();
    console.log("✅ [CHATS API] Request parsed:", {
      title: title || "No title provided",
    });

    console.log("💾 [CHATS API] Connecting to database...");
    const client = await clientPromise;
    const db = client.db("chatgpt-clone");
    console.log("✅ [CHATS API] Database connection established");

    const newChat = {
      userId,
      title: title || "New Chat",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log("💾 [CHATS API] Inserting new chat:", {
      userId,
      title: newChat.title,
      timestamp: newChat.createdAt.toISOString(),
    });

    const result = await db.collection("chats").insertOne(newChat);
    console.log(
      "✅ [CHATS API] Chat created with ID:",
      result.insertedId.toString()
    );

    const responseData = {
      id: result.insertedId.toString(),
      title: newChat.title,
      createdAt: newChat.createdAt,
      updatedAt: newChat.updatedAt,
      messages: [],
    };
    console.log("📤 [CHATS API] Returning created chat data");

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("💥 [CHATS API] POST Error occurred:", {
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
