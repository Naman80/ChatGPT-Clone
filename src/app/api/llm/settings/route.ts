import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getLLMService, getConfigFromEnv } from "@/lib/llm";

export async function GET() {
  console.log("🚀 [LLM SETTINGS API] Starting GET request");

  try {
    console.log("🔐 [LLM SETTINGS API] Authenticating user...");
    const { userId } = await auth();

    if (!userId) {
      console.log("❌ [LLM SETTINGS API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("⚙️ [LLM SETTINGS API] Getting LLM configuration...");
    const llmService = getLLMService(getConfigFromEnv());
    const settings = llmService.getConfig();
    const availableModels = llmService.getAvailableModels();
    const allModels = llmService.getAllAvailableModels();

    console.log("✅ [LLM SETTINGS API] Configuration retrieved:", {
      provider: settings.provider,
      model: settings.model,
      availableModelsCount: availableModels.length,
      totalModelsCount: allModels.length,
    });

    return NextResponse.json({
      settings,
      availableModels,
      allModels,
      validation: await llmService.validateProvider(),
    });
  } catch (error) {
    console.error("💥 [LLM SETTINGS API] GET Error occurred:", {
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
  console.log("🚀 [LLM SETTINGS API] Starting POST request");

  try {
    console.log("🔐 [LLM SETTINGS API] Authenticating user...");
    const { userId } = await auth();

    if (!userId) {
      console.log("❌ [LLM SETTINGS API] Authentication failed - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📝 [LLM SETTINGS API] Parsing request body...");
    const body = await req.json();
    const { provider, model } = body;

    console.log("✅ [LLM SETTINGS API] Request parsed:", {
      provider: provider || "Not provided",
      model: model || "Not provided",
    });

    const llmService = getLLMService();

    // If switching provider
    if (provider) {
      console.log("🔄 [LLM SETTINGS API] Switching provider to:", provider);
      llmService.updateConfig({ provider });
    }

    // If switching model
    if (model) {
      console.log("🔄 [LLM SETTINGS API] Switching model to:", model);
      const success = llmService.switchModel(model);
      if (!success) {
        console.log("❌ [LLM SETTINGS API] Model not found:", model);
        return NextResponse.json({ error: "Model not found" }, { status: 400 });
      }
    }

    // Validate the new configuration
    const validation = await llmService.validateProvider();
    if (!validation.valid) {
      console.log(
        "❌ [LLM SETTINGS API] Provider validation failed:",
        validation.error
      );
      return NextResponse.json(
        { error: `Provider validation failed: ${validation.error}` },
        { status: 400 }
      );
    }

    const newSettings = llmService.getConfig();
    const availableModels = llmService.getAvailableModels();

    console.log("✅ [LLM SETTINGS API] Settings updated successfully:", {
      provider: newSettings.provider,
      model: newSettings.model,
    });

    return NextResponse.json({
      settings: newSettings,
      availableModels,
      validation,
    });
  } catch (error) {
    console.error("💥 [LLM SETTINGS API] POST Error occurred:", {
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
