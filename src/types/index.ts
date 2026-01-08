/**
 * Shared TypeScript types and interfaces
 * Centralized type definitions to avoid duplication
 */

// ==================== Auth Types ====================
export type UserRole = 'admin' | 'user';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface AuthToken {
    accessToken: string;
    expiresAt: number; // Unix timestamp
    userId: string;
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    iat: number; // issued at
    exp: number; // expiration
}

export interface AuthResponse {
    user: User;
    token: AuthToken;
}

// ==================== Transaction Types ====================
export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Transaction {
    id: string;
    date: string; // ISO
    concept: string;
    amount: number;
    status: TransactionStatus;
    merchant: string;
    category: string;
}

export interface TransactionFilters {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: TransactionStatus | 'ALL';
}

export interface TransactionSort {
    field: 'date' | 'amount';
    direction: 'asc' | 'desc';
}

// ==================== Generic Types ====================
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ==================== Financial Types ====================
export interface Account {
    id: string;
    name: string;
    number: string; // Account number (masked)
    balance: number;
    currency: 'USD' | 'EUR' | 'COP';
    type: 'checking' | 'savings' | 'credit';
    lastUpdated: string; // ISO Date
}

export interface Balance {
    available: number;
    currency: string;
    lastUpdated: string;
}
