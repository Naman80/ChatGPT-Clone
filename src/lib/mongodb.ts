import { MongoClient } from "mongodb";

console.log("📦 [MONGODB] MongoDB utility loading...");

if (!process.env.MONGODB_URI) {
  console.error("❌ [MONGODB] MONGODB_URI environment variable is missing!");
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

console.log("✅ [MONGODB] MONGODB_URI found in environment variables");
const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  console.log(
    "🛠️ [MONGODB] Running in development mode - using global variable for connection pooling"
  );
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    console.log("🔄 [MONGODB] Creating new MongoDB client and connection...");
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();

    globalWithMongo._mongoClientPromise
      .then(() =>
        console.log(
          "✅ [MONGODB] Successfully connected to MongoDB (development)"
        )
      )
      .catch((error) =>
        console.error(
          "❌ [MONGODB] Failed to connect to MongoDB (development):",
          error
        )
      );
  } else {
    console.log(
      "🔄 [MONGODB] Reusing existing MongoDB connection (development)"
    );
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  console.log(
    "🏠 [MONGODB] Running in production mode - creating direct connection"
  );
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();

  clientPromise
    .then(() =>
      console.log("✅ [MONGODB] Successfully connected to MongoDB (production)")
    )
    .catch((error) =>
      console.error(
        "❌ [MONGODB] Failed to connect to MongoDB (production):",
        error
      )
    );
}

console.log("📦 [MONGODB] MongoDB utility loaded successfully");

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
