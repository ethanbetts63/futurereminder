import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAppConfig, type AppConfig } from '@/api/config';

// --- Type Definitions ---
interface ConfigContextType {
  config: AppConfig | null;
  isLoading: boolean;
  error: string | null;
}

// --- Context Creation ---
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// --- Provider Component ---
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, fetch the application configuration
    const fetchConfig = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const configData = await getAppConfig();
        setConfig(configData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch app configuration.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const value = {
    config,
    isLoading,
    error,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

// --- Custom Hook ---
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
