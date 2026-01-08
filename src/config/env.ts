/**
 * Environment Configuration
 * Type-safe access to environment variables
 */

interface EnvConfig {
  // API
  apiUrl: string;
  apiTimeout: number;
  
  // Auth
  tokenExpirationMinutes: number;
  tokenRefreshThresholdMinutes: number;
  
  // Features
  enableDevTools: boolean;
  enableMockData: boolean;
  
  // Environment
  appEnv: 'development' | 'staging' | 'production';
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const getEnvBool = (key: string, defaultValue = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === true;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const env: EnvConfig = {
  // API
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000'),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  
  // Auth
  tokenExpirationMinutes: getEnvNumber('VITE_TOKEN_EXPIRATION_MINUTES', 15),
  tokenRefreshThresholdMinutes: getEnvNumber('VITE_TOKEN_REFRESH_THRESHOLD_MINUTES', 5),
  
  // Features
  enableDevTools: getEnvBool('VITE_ENABLE_DEV_TOOLS', true),
  enableMockData: getEnvBool('VITE_ENABLE_MOCK_DATA', true),
  
  // Environment
  appEnv: (getEnvVar('VITE_APP_ENV', 'development') as EnvConfig['appEnv']),
  isDevelopment: getEnvVar('VITE_APP_ENV', 'development') === 'development',
  isProduction: getEnvVar('VITE_APP_ENV', 'development') === 'production',
};

// Log environment in development
if (env.isDevelopment) {
  console.log('🔧 Environment Config:', {
    appEnv: env.appEnv,
    apiUrl: env.apiUrl,
    enableMockData: env.enableMockData,
  });
}
