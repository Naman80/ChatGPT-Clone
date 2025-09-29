import { MongoClient, Db, Collection } from "mongodb";
import { generateId, UIMessage } from "ai";
import clientPromise from "./mongodb";

/**
 * Chat database operations optimized for Vercel AI SDK
 */

// Constants for database configuration
const DB_NAME = "chatgpt-clone";
const COLLECTION_NAME = "chats_v2";

// Interface for ChatDocument (unchanged)
export interface ChatDocument {
  _id?: string;
  chatId: string;
  userId: string;
  title: string;
  messages: UIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Helper function to get the chats collection
 * @param client - Optional MongoClient; uses clientPromise if not provided
 */
async function getChatsCollection(
  client?: MongoClient
): Promise<Collection<ChatDocument>> {
  const mongoClient = client || (await clientPromise);
  const db: Db = mongoClient.db(DB_NAME);
  return db.collection<ChatDocument>(COLLECTION_NAME);
}

/**
 * Create a new chat in the database
 */
export async function createChatInDB(
  userId: string,
  chatId?: string,
  title: string = "New Chat"
): Promise<string> {
  const collection = await getChatsCollection();

  const newChatId = chatId ?? generateId();

  const chatDocument: Omit<ChatDocument, "_id"> = {
    chatId: newChatId,
    userId,
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await collection.insertOne(chatDocument);
  return newChatId;
}

/**
 * Load a chat with all its messages
 */
export async function loadChatFromDB(
  chatId: string,
  userId: string
): Promise<UIMessage[]> {
  const collection = await getChatsCollection();

  const chat = await collection.findOne<ChatDocument>({
    chatId: chatId,
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
  const collection = await getChatsCollection();

  const result = await collection.updateOne(
    { chatId, userId },
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
  const collection = await getChatsCollection();

  const chats = await collection
    .find<ChatDocument>(
      { userId },
      {
        projection: {
          userId: 0,
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
  const collection = await getChatsCollection();

  const result = await collection.deleteOne({
    chatId: chatId,
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
  const collection = await getChatsCollection();

  const result = await collection.updateOne(
    { chatId: chatId, userId },
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
  const collection = await getChatsCollection();

  const count = await collection.countDocuments({
    chatId: chatId,
    userId,
  });

  return count > 0;
}
