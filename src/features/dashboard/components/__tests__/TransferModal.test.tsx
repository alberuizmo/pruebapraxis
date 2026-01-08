import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransferModal } from '../TransferModal';
import type { Account } from '@/types';

describe('TransferModal', () => {
    const mockOnClose = vi.fn();

    const mockCurrentAccount: Account = {
        id: '1',
        name: 'Daily Expenses',
        number: '**** 1234',
        balance: 1200.00,
        currency: 'USD',
        type: 'checking',
        lastUpdated: '2026-01-08T10:00:00Z'
    };

    const mockAccounts: Account[] = [
        mockCurrentAccount,
        {
            id: '2',
            name: 'Main Savings',
            number: '**** 4589',
            balance: 24500.50,
            currency: 'USD',
            type: 'savings',
            lastUpdated: '2026-01-08T10:00:00Z'
        },
        {
            id: '3',
            name: 'Emergency Fund',
            number: '**** 7890',
            balance: 5000.00,
            currency: 'USD',
            type: 'savings',
            lastUpdated: '2026-01-08T10:00:00Z'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the transfer form when opened', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        expect(screen.getByText('New Transfer')).toBeInTheDocument();
        expect(screen.getByText('From Account')).toBeInTheDocument();
        expect(screen.getByText('To Account')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
    });

    it('should display current account information', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        expect(screen.getByText('Daily Expenses')).toBeInTheDocument();
        expect(screen.getByText('**** 1234')).toBeInTheDocument();
        expect(screen.getByText('$1,200.00')).toBeInTheDocument();
    });

    it('should filter out current account from destination options', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const select = screen.getByLabelText('To Account') as HTMLSelectElement;
        const options = Array.from(select.options);

        // Should have 3 options: placeholder + 2 other accounts (excluding current)
        expect(options).toHaveLength(3);
        expect(options[1].textContent).toContain('Main Savings');
        expect(options[2].textContent).toContain('Emergency Fund');
        expect(options.find(opt => opt.textContent?.includes('Daily Expenses'))).toBeUndefined();
    });

    it('should show error when amount is zero or negative', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const amountInput = screen.getByLabelText('Amount');
        
        // Test with zero
        fireEvent.change(amountInput, { target: { value: '0' } });
        expect(screen.getByText('Amount must be greater than zero')).toBeInTheDocument();

        // Test with negative number
        fireEvent.change(amountInput, { target: { value: '-50' } });
        expect(screen.getByText('Amount must be greater than zero')).toBeInTheDocument();
    });

    it('should show error when amount exceeds balance', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const amountInput = screen.getByLabelText('Amount');
        
        // Enter amount greater than balance (1200.00)
        fireEvent.change(amountInput, { target: { value: '1500' } });
        
        expect(screen.getByText('Insufficient balance for this transfer')).toBeInTheDocument();
    });

    it('should not show error for valid amount', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const amountInput = screen.getByLabelText('Amount');
        
        // Enter valid amount
        fireEvent.change(amountInput, { target: { value: '100' } });
        
        expect(screen.queryByText('Amount must be greater than zero')).not.toBeInTheDocument();
        expect(screen.queryByText('Insufficient balance for this transfer')).not.toBeInTheDocument();
    });

    it('should disable transfer button when form is invalid', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const transferButton = screen.getByRole('button', { name: /Transfer/i });

        // Initially disabled (no amount and destination)
        expect(transferButton).toBeDisabled();

        // Enter amount but no destination
        const amountInput = screen.getByLabelText('Amount');
        fireEvent.change(amountInput, { target: { value: '100' } });
        expect(transferButton).toBeDisabled();

        // Select destination
        const select = screen.getByLabelText('To Account');
        fireEvent.change(select, { target: { value: '2' } });
        expect(transferButton).not.toBeDisabled();
    });

    it('should disable transfer button when amount exceeds balance', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const amountInput = screen.getByLabelText('Amount');
        const select = screen.getByLabelText('To Account');
        const transferButton = screen.getByRole('button', { name: /Transfer/i });

        // Enter valid amount and select destination
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.change(select, { target: { value: '2' } });
        expect(transferButton).not.toBeDisabled();

        // Now exceed balance
        fireEvent.change(amountInput, { target: { value: '2000' } });
        expect(transferButton).toBeDisabled();
    });

    it('should call onClose when cancel button is clicked', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should show success message after transfer', async () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const amountInput = screen.getByLabelText('Amount');
        const select = screen.getByLabelText('To Account');
        const transferButton = screen.getByRole('button', { name: /Transfer/i });

        // Fill form
        fireEvent.change(amountInput, { target: { value: '250.50' } });
        fireEvent.change(select, { target: { value: '2' } });

        // Submit transfer
        fireEvent.click(transferButton);

        // Should show success screen
        expect(await screen.findByText('Transfer Successful!')).toBeInTheDocument();
        expect(screen.getByText('$250.50 transferred successfully')).toBeInTheDocument();
    });

    it('should call onClose after successful transfer timeout', async () => {
        vi.useFakeTimers();
        
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const amountInput = screen.getByLabelText('Amount');
        const select = screen.getByLabelText('To Account');
        const transferButton = screen.getByRole('button', { name: /Transfer/i });

        // Fill and submit form
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.change(select, { target: { value: '2' } });
        fireEvent.click(transferButton);

        // Fast-forward past the 2 second timeout
        await vi.advanceTimersByTimeAsync(2100);

        // Should have called onClose
        expect(mockOnClose).toHaveBeenCalled();
        
        vi.useRealTimers();
    });

    it('should update transfer button text with amount', () => {
        render(
            <TransferModal
                isOpen={true}
                onClose={mockOnClose}
                currentAccount={mockCurrentAccount}
                accounts={mockAccounts}
            />
        );

        const amountInput = screen.getByLabelText('Amount');
        const transferButton = screen.getByRole('button', { name: /Transfer/i });

        // Initially shows $0.00
        expect(transferButton).toHaveTextContent('Transfer $0.00');

        // Update amount
        fireEvent.change(amountInput, { target: { value: '75' } });
        expect(transferButton).toHaveTextContent('Transfer $75');
    });
});
