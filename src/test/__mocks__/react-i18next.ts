import { vi } from 'vitest';

// Mock simple de react-i18next para tests
export const useTranslation = () => ({
  t: (key: string) => key,
  i18n: {
    language: 'en',
    changeLanguage: vi.fn(),
  },
});

export const Trans = ({ children }: { children: React.ReactNode }) => children;

export const I18nextProvider = ({ children }: { children: React.ReactNode }) => children;
