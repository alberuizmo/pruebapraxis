import { render, screen, fireEvent } from '@testing-library/react';
import { BalanceCard } from '../BalanceCard';
import { describe, it, expect } from 'vitest';
import type { Account } from '@/types';

describe('BalanceCard', () => {
    const mockAccount: Account = {
        id: 'acc_1',
        name: 'Main Savings',
        number: '**** 4589',
        balance: 24500.50,
        currency: 'USD',
        type: 'savings',
        lastUpdated: new Date().toISOString()
    };

    it('shows loading skeleton when loading', () => {
        const { container } = render(
            <BalanceCard account={null} isLoading={true} />
        );
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders null when no account provided', () => {
        const { container } = render(
            <BalanceCard account={null} isLoading={false} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays account balance correctly', () => {
        render(<BalanceCard account={mockAccount} isLoading={false} />);
        expect(screen.getByText('$24,500.50')).toBeInTheDocument();
    });

    it('displays account name and number', () => {
        render(<BalanceCard account={mockAccount} isLoading={false} />);
        expect(screen.getByText(/Main Savings/)).toBeInTheDocument();
        expect(screen.getByText(/\*\*\*\* 4589/)).toBeInTheDocument();
    });

    it('toggles balance visibility when eye icon clicked', () => {
        render(<BalanceCard account={mockAccount} isLoading={false} />);
        
        // Balance should be visible initially
        expect(screen.getByText('$24,500.50')).toBeInTheDocument();
        
        // Click eye icon to hide
        const eyeButton = screen.getByRole('button');
        fireEvent.click(eyeButton);
        
        // Balance should be hidden
        expect(screen.getByText('••••••••')).toBeInTheDocument();
        expect(screen.queryByText('$24,500.50')).not.toBeInTheDocument();
    });

    it('formats currency based on account currency', () => {
        const eurAccount: Account = {
            ...mockAccount,
            currency: 'EUR',
            balance: 10000
        };
        render(<BalanceCard account={eurAccount} isLoading={false} />);
        expect(screen.getByText('€10,000.00')).toBeInTheDocument();
    });
});
