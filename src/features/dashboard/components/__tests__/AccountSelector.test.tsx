import { render, screen, fireEvent } from '@testing-library/react';
import { AccountSelector } from '../AccountSelector';
import { describe, it, expect, vi } from 'vitest';
import type { Account } from '@/types';

describe('AccountSelector', () => {
    const mockAccounts: Account[] = [
        {
            id: 'acc_1',
            name: 'Main Savings',
            number: '**** 4589',
            balance: 24500.50,
            currency: 'USD',
            type: 'savings',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 'acc_2',
            name: 'Daily Expenses',
            number: '**** 1234',
            balance: 1200.00,
            currency: 'USD',
            type: 'checking',
            lastUpdated: new Date().toISOString()
        }
    ];

    it('shows loading skeleton when loading', () => {
        const { container } = render(
            <AccountSelector 
                accounts={undefined} 
                selectedId={undefined} 
                onSelect={vi.fn()} 
                isLoading={true} 
            />
        );
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders null when no accounts', () => {
        const { container } = render(
            <AccountSelector 
                accounts={[]} 
                selectedId={undefined} 
                onSelect={vi.fn()} 
                isLoading={false} 
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('displays selected account name', () => {
        render(
            <AccountSelector 
                accounts={mockAccounts} 
                selectedId="acc_1" 
                onSelect={vi.fn()} 
                isLoading={false} 
            />
        );
        expect(screen.getByText('Main Savings')).toBeInTheDocument();
    });

    it('opens dropdown on button click', () => {
        render(
            <AccountSelector 
                accounts={mockAccounts} 
                selectedId="acc_1" 
                onSelect={vi.fn()} 
                isLoading={false} 
            />
        );
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        // Both accounts should be visible in dropdown
        expect(screen.getByText('Daily Expenses')).toBeInTheDocument();
        expect(screen.getByText('**** 1234')).toBeInTheDocument();
    });

    it('calls onSelect when account is clicked', () => {
        const mockOnSelect = vi.fn();
        render(
            <AccountSelector 
                accounts={mockAccounts} 
                selectedId="acc_1" 
                onSelect={mockOnSelect} 
                isLoading={false} 
            />
        );
        
        // Open dropdown
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        // Click on second account
        const account2Button = screen.getByText('Daily Expenses').closest('button');
        fireEvent.click(account2Button!);
        
        expect(mockOnSelect).toHaveBeenCalledWith('acc_2');
    });
});
