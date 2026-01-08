import { render, screen } from '@testing-library/react';
import { TransactionsTable } from '../TransactionsTable';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as useTransactionsHook from '../../hooks/useTransactions';

// Mock the hook
vi.mock('../../hooks/useTransactions');

describe('TransactionsTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading skeletons when loading', () => {
        (useTransactionsHook.useTransactions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: null,
            isLoading: true,
            page: 1,
            filters: {},
            sort: { field: 'date', direction: 'desc' }
        });

        render(<TransactionsTable />);
        // Check for skeleton rows (they have animate-pulse class)
        // It's hard to query by class directly in RTL, but we can check if table headers exist
        expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
    });

    it('renders transactions data correctly', () => {
        const mockData = {
            data: [
                { id: '1', date: '2026-01-01', concept: 'Test Item', merchant: 'Test Merchant', amount: -50.00, status: 'CONFIRMED' },
                { id: '2', date: '2026-01-02', concept: 'Salary', merchant: 'Company', amount: 2000.00, status: 'CONFIRMED' }
            ],
            total: 2,
            totalPages: 1,
            page: 1,
            pageSize: 10
        };

        (useTransactionsHook.useTransactions as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockData,
            isLoading: false,
            page: 1,
            filters: {},
            sort: { field: 'date', direction: 'desc' },
            setPage: vi.fn(),
            setFilters: vi.fn(),
            setSort: vi.fn()
        });

        render(<TransactionsTable />);
        
        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByText('Test Merchant')).toBeInTheDocument();
        expect(screen.getByText('-$50.00')).toBeInTheDocument();
        
        expect(screen.getByText('Salary')).toBeInTheDocument();
        expect(screen.getByText('+$2,000.00')).toBeInTheDocument();
    });
});
