import { UIMessage } from "ai";
import clientPromise from "./mongodb";

/**
 * Chat database operations optimized for Vercel AI SDK
 */

export interface ChatDocument {
  _id?: string;
  id: string;
  userId: string;
  title: string;
  messages: UIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new chat in the database
 */
export async function createChatInDB(
  userId: string,
  title: string = "New Chat"
): Promise<string> {
  const client = await clientPromise;
  const db = client.db("chatgpt-clone");

  const chatId = `chat_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2)}`;

  const chatDocument: Omit<ChatDocument, "_id"> = {
    id: chatId,
    userId,
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection("chats_v2").insertOne(chatDocument);
  return chatId;
}

/**
 * Load a chat with all its messages
 */
export async function loadChatFromDB(
  chatId: string,
  userId: string
): Promise<UIMessage[]> {
  const client = await clientPromise;
  const db = client.db("chatgpt-clone");

  const chat = await db.collection("chats_v2").findOne<ChatDocument>({
    id: chatId,
    userId,
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  return chat.messages || [];
}

/**
 * Save messages to a chat (atomic operation)
 * This replaces the entire message array to ensure consistency
 */
export async function saveChatMessages(
  chatId: string,
  userId: string,
  messages: UIMessage[]
): Promise<void> {
  const client = await clientPromise;
  const db = client.db("chatgpt-clone");

  const result = await db.collection("chats_v2").updateOne(
    { id: chatId, userId },
    {
      $set: {
        messages,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Chat not found or access denied");
  }
}

/**
 * Get all chats for a user (without messages for performance)
 */
export async function getUserChats(
  userId: string
): Promise<Array<Omit<ChatDocument, "messages">>> {
  const client = await clientPromise;
  const db = client.db("chatgpt-clone");

  const chats = await db
    .collection<ChatDocument>("chats_v2")
    .find(
      { userId },
      {
        projection: {
          messages: 0, // Exclude messages for performance
          _id: 0,
        },
      }
    )
    .sort({ updatedAt: -1 })
    .toArray();

  return chats as Array<Omit<ChatDocument, "messages">>;
}

/**
 * Delete a chat and all its messages
 */
export async function deleteChatFromDB(
  chatId: string,
  userId: string
): Promise<void> {
  const client = await clientPromise;
  const db = client.db("chatgpt-clone");

  const result = await db.collection("chats_v2").deleteOne({
    id: chatId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Chat not found or access denied");
  }
}

/**
 * Update chat title
 */
export async function updateChatTitle(
  chatId: string,
  userId: string,
  title: string
): Promise<void> {
  const client = await clientPromise;
  const db = client.db("chatgpt-clone");

  const result = await db.collection("chats_v2").updateOne(
    { id: chatId, userId },
    {
      $set: {
        title,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Chat not found or access denied");
  }
}

/**
 * Check if a chat exists and belongs to the user
 */
export async function chatExists(
  chatId: string,
  userId: string
): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("chatgpt-clone");

  const count = await db.collection("chats_v2").countDocuments({
    id: chatId,
    userId,
  });

  return count > 0;
}
