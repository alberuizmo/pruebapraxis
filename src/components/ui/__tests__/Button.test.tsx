import { render, screen } from '@testing-library/react';
import { Button } from '../index';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-financial-primary'); // Default variant
    });

    it('renders outline variant correctly', () => {
        render(<Button variant="outline">Outline</Button>);
        const button = screen.getByRole('button', { name: /outline/i });
        expect(button).toHaveClass('border-slate-200');
    });

    it('handles disabled state', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:opacity-50');
    });
});
