import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as useAuthHook from '../../hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';

// Mock the hook
vi.mock('../../hooks/useAuth');

const mockLogin = vi.fn();

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthHook.useAuth as any).mockReturnValue({
            login: mockLogin,
            isLoggingIn: false,
            loginError: null
        });
    });

    const renderComponent = () => render(
        <BrowserRouter>
            <LoginForm />
        </BrowserRouter>
    );

    it('renders login form correctly', () => {
        renderComponent();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('validates empty inputs', async () => {
        renderComponent();
        
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
        
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('calls login with correct credentials on submit', async () => {
        renderComponent();
        
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i); // Password input usually doesn't have role=textbox if type=password

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });
});
