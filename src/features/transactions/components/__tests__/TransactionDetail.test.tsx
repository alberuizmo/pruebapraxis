import { render, screen } from '@testing-library/react';
import { TransactionDetail } from '../TransactionDetail';
import { describe, it, expect } from 'vitest';
import type { Transaction } from '@/types';

describe('TransactionDetail', () => {
    const mockTransaction: Transaction = {
        id: 'txn_123',
        date: '2026-01-05T10:30:00.000Z',
        concept: 'Amazon Purchase',
        amount: -125.50,
        status: 'CONFIRMED',
        merchant: 'Amazon.com',
        category: 'Shopping'
    };

    it('displays transaction amount correctly', () => {
        render(<TransactionDetail transaction={mockTransaction} />);
        expect(screen.getByText('-$125.50')).toBeInTheDocument();
    });

    it('displays transaction status badge', () => {
        render(<TransactionDetail transaction={mockTransaction} />);
        expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    });

    it('displays transaction details', () => {
        render(<TransactionDetail transaction={mockTransaction} />);
        
        expect(screen.getByText('txn_123')).toBeInTheDocument();
        expect(screen.getByText('Shopping')).toBeInTheDocument();
        expect(screen.getByText('Amazon.com')).toBeInTheDocument();
        expect(screen.getByText('Amazon Purchase')).toBeInTheDocument();
    });

    it('shows positive amount in green for income', () => {
        const incomeTransaction: Transaction = {
            ...mockTransaction,
            amount: 2500.00
        };
        render(<TransactionDetail transaction={incomeTransaction} />);
        
        const amountElement = screen.getByText('$2,500.00');
        expect(amountElement).toHaveClass('text-emerald-600');
    });

    it('applies correct status badge color for PENDING', () => {
        const pendingTransaction: Transaction = {
            ...mockTransaction,
            status: 'PENDING'
        };
        render(<TransactionDetail transaction={pendingTransaction} />);
        
        const badge = screen.getByText('PENDING');
        expect(badge).toHaveClass('bg-yellow-100');
        expect(badge).toHaveClass('text-yellow-800');
    });

    it('applies correct status badge color for FAILED', () => {
        const failedTransaction: Transaction = {
            ...mockTransaction,
            status: 'FAILED'
        };
        render(<TransactionDetail transaction={failedTransaction} />);
        
        const badge = screen.getByText('FAILED');
        expect(badge).toHaveClass('bg-red-100');
        expect(badge).toHaveClass('text-red-800');
    });

    it('formats date correctly', () => {
        render(<TransactionDetail transaction={mockTransaction} />);
        // Check that a date is displayed (format may vary by locale)
        expect(screen.getByText(/2026/)).toBeInTheDocument();
        expect(screen.getByText(/January/)).toBeInTheDocument();
    });
});
