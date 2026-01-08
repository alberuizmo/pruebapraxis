/**
 * Shared constants
 * Centralized constant definitions for consistency
 */

// ==================== Pagination ====================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE: 1,
} as const;

// ==================== Authentication ====================
export const AUTH = {
  TOKEN_EXPIRATION_MS: 15 * 60 * 1000, // 15 minutes
  REFRESH_THRESHOLD_MS: 5 * 60 * 1000, // 5 minutes
  REFRESH_CHECK_INTERVAL_MS: 60 * 1000, // 1 minute
  SESSION_STORAGE_KEY: 'auth_token',
} as const;

// ==================== Transaction ====================
export const TRANSACTION = {
  STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    FAILED: 'FAILED',
  },
  STATUS_STYLES: {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    FAILED: 'bg-red-100 text-red-800 border-red-200',
  },
  MOCK_DATA_COUNT: 5000,
} as const;

// ==================== Query Keys ====================
export const QUERY_KEYS = {
  AUTH: {
    SESSION: ['auth', 'session'],
  },
  FINANCIAL: {
    ACCOUNTS: ['financial', 'accounts'],
  },
  TRANSACTIONS: (page: number, pageSize: number, filters: unknown, sort: unknown) => 
    ['transactions', page, pageSize, filters, sort],
} as const;

// ==================== Routes ====================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const;

// ==================== Date Formats ====================
export const DATE_FORMATS = {
  DISPLAY: 'en-US', // locale for display
  ISO: 'YYYY-MM-DD',
} as const;
