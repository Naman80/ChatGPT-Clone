import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { openai } from "@ai-sdk/openai";

// LLM Provider types
export type LLMProvider = "openrouter" | "openai";

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: LLMProvider;
  description?: string;
  contextLength?: number;
  costPer1kTokens?: {
    input: number;
    output: number;
  };
}

// Available models configuration
export const AVAILABLE_MODELS: Record<LLMProvider, LLMModel[]> = {
  openrouter: [
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "openrouter",
      description: "Anthropic's most powerful model with excellent reasoning",
      contextLength: 200000,
      costPer1kTokens: { input: 3.0, output: 15.0 },
    },
    {
      id: "meta-llama/llama-3.1-405b-instruct",
      name: "Llama 3.1 405B Instruct",
      provider: "openrouter",
      description: "Meta's largest and most capable open source model",
      contextLength: 128000,
      costPer1kTokens: { input: 2.7, output: 2.7 },
    },
    {
      id: "meta-llama/llama-3.1-70b-instruct",
      name: "Llama 3.1 70B Instruct",
      provider: "openrouter",
      description: "High-performance open source model",
      contextLength: 128000,
      costPer1kTokens: { input: 0.52, output: 0.75 },
    },
    {
      id: "google/gemini-pro-1.5",
      name: "Gemini Pro 1.5",
      provider: "openrouter",
      description: "Google's advanced multimodal model",
      contextLength: 1000000,
      costPer1kTokens: { input: 1.25, output: 5.0 },
    },
    {
      id: "mistralai/mistral-large",
      name: "Mistral Large",
      provider: "openrouter",
      description: "Mistral's flagship model for complex tasks",
      contextLength: 128000,
      costPer1kTokens: { input: 3.0, output: 9.0 },
    },
  ],
  openai: [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "openai",
      description: "OpenAI's most advanced model",
      contextLength: 128000,
      costPer1kTokens: { input: 5.0, output: 15.0 },
    },
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      provider: "openai",
      description: "Fast and cost-effective model",
      contextLength: 128000,
      costPer1kTokens: { input: 0.15, output: 0.6 },
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "openai",
      description: "Reliable and fast general-purpose model",
      contextLength: 16385,
      costPer1kTokens: { input: 0.5, output: 1.5 },
    },
  ],
};

// Default configuration
export const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: "openrouter",
  model: "meta-llama/llama-3.1-70b-instruct", // Good balance of performance and cost
};

/**
 * LLM Service - Centralized service for managing different LLM providers
 */
export class LLMService {
  private static instance: LLMService;
  private config: LLMConfig;

  private constructor(config: LLMConfig = DEFAULT_LLM_CONFIG) {
    this.config = config;
  }

  public static getInstance(config?: LLMConfig): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService(config);
    }
    return LLMService.instance;
  }

  /**
   * Get the configured model instance for AI SDK
   */
  public getModel() {
    switch (this.config.provider) {
      case "openrouter": {
        const openrouter = createOpenRouter({
          apiKey: process.env.OPENROUTER_API_KEY || this.config.apiKey,
        });
        return openrouter.chat(this.config.model);
      }
      case "openai": {
        return openai(this.config.model);
      }
      default:
        throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
    }
  }

  /**
   * Update the current configuration
   */
  public updateConfig(newConfig: Partial<LLMConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  public getConfig(): LLMConfig {
    return { ...this.config };
  }

  /**
   * Get available models for current provider
   */
  public getAvailableModels(): LLMModel[] {
    return AVAILABLE_MODELS[this.config.provider] || [];
  }

  /**
   * Get all available models across all providers
   */
  public getAllAvailableModels(): LLMModel[] {
    return Object.values(AVAILABLE_MODELS).flat();
  }

  /**
   * Get model info by ID
   */
  public getModelInfo(modelId: string): LLMModel | undefined {
    return this.getAllAvailableModels().find((model) => model.id === modelId);
  }

  /**
   * Switch to a different model
   */
  public switchModel(modelId: string): boolean {
    const modelInfo = this.getModelInfo(modelId);
    if (!modelInfo) {
      return false;
    }

    this.updateConfig({
      provider: modelInfo.provider,
      model: modelId,
    });

    return true;
  }

  /**
   * Get provider status and validate API keys
   */
  public async validateProvider(): Promise<{ valid: boolean; error?: string }> {
    try {
      switch (this.config.provider) {
        case "openrouter":
          if (!process.env.OPENROUTER_API_KEY && !this.config.apiKey) {
            return { valid: false, error: "OPENROUTER_API_KEY not found" };
          }
          break;
        case "openai":
          if (!process.env.OPENAI_API_KEY && !this.config.apiKey) {
            return { valid: false, error: "OPENAI_API_KEY not found" };
          }
          break;
      }
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

/**
 * Convenience function to get the LLM service instance
 */
export const getLLMService = (config?: LLMConfig) => {
  return LLMService.getInstance(config);
};

/**
 * Convenience function to get the current model
 */
export const getCurrentModel = () => {
  return getLLMService().getModel();
};

/**
 * Configuration from environment variables
 */
export const getConfigFromEnv = (): LLMConfig => {
  const provider = (process.env.LLM_PROVIDER as LLMProvider) || "openrouter";
  const model =
    process.env.LLM_MODEL ||
    (provider === "openrouter"
      ? "meta-llama/llama-3.1-70b-instruct"
      : "gpt-4o-mini");

  return {
    provider,
    model,
  };
};
