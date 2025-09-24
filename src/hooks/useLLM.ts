"use client";

import { useState, useEffect, useCallback } from "react";
import { LLMModel, LLMProvider } from "@/lib/llm";

export interface LLMSettings {
  provider: LLMProvider;
  model: string;
}

export interface UseLLMReturn {
  currentSettings: LLMSettings;
  availableModels: LLMModel[];
  isLoading: boolean;
  error: string | null;
  switchModel: (modelId: string) => Promise<boolean>;
  switchProvider: (provider: LLMProvider) => Promise<boolean>;
  refreshModels: () => Promise<void>;
}

/**
 * React hook for managing LLM settings and models
 */
export function useLLM(): UseLLMReturn {
  const [currentSettings, setCurrentSettings] = useState<LLMSettings>({
    provider: "openrouter",
    model: "meta-llama/llama-3.1-70b-instruct",
  });
  const [availableModels, setAvailableModels] = useState<LLMModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current LLM settings from the API
  const fetchCurrentSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/llm/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch LLM settings");
      }

      const data = await response.json();
      setCurrentSettings(data.settings);
      setAvailableModels(data.availableModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch to a different model
  const switchModel = useCallback(async (modelId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/llm/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelId }),
      });

      if (!response.ok) {
        throw new Error("Failed to switch model");
      }

      const data = await response.json();
      setCurrentSettings(data.settings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch to a different provider
  const switchProvider = useCallback(
    async (provider: LLMProvider): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/llm/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider }),
        });

        if (!response.ok) {
          throw new Error("Failed to switch provider");
        }

        const data = await response.json();
        setCurrentSettings(data.settings);
        setAvailableModels(data.availableModels);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Refresh available models
  const refreshModels = useCallback(async () => {
    await fetchCurrentSettings();
  }, [fetchCurrentSettings]);

  // Load initial settings
  useEffect(() => {
    fetchCurrentSettings();
  }, [fetchCurrentSettings]);

  return {
    currentSettings,
    availableModels,
    isLoading,
    error,
    switchModel,
    switchProvider,
    refreshModels,
  };
}

/**
 * Hook for getting model information
 */
export function useModelInfo(modelId?: string) {
  const { availableModels } = useLLM();

  return availableModels.find((model) => model.id === modelId);
}
