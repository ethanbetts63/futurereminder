import { create } from 'zustand';
import { getAppConfig, type AppConfig } from '@/api/config';

interface ConfigState {
  config: AppConfig | null;
  isLoading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  isLoading: true,
  error: null,
  fetchConfig: async () => {
    try {
      set({ isLoading: true, error: null });
      const configData = await getAppConfig();
      set({ config: configData, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch app configuration.', 
        isLoading: false 
      });
    }
  },
}));
