/**
 * Authentication Service
 * 
 * PRODUCTION SECURITY NOTES:
 * 1. Tokens stored in sessionStorage (cleared on browser close)
 * 2. In production, refresh tokens would be in httpOnly cookies (not accessible via JS)
 * 3. All API calls must include Authorization header with Bearer token
 * 4. HTTPS enforced in production
 * 5. Rate limiting on login attempts (backend)
 * 6. 2FA required for sensitive operations
 * 7. Audit logging of authentication events
 */

import { TokenManager } from '@/lib/auth-tokens';
import type { User, LoginCredentials, AuthResponse } from '@/types';

export const AuthService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Strict Validation
        if (credentials.email !== 'test@example.com' || credentials.password !== 'password123') {
            throw new Error("Invalid credentials");
        }
        
        // In production, backend returns:
        // - User data (non-sensitive)
        // - Access token (JWT, short-lived)
        // - Refresh token (httpOnly cookie, NOT returned in response)
        
        const user: User = {
            id: 'u_123',
            email: credentials.email,
            name: 'Test User',
            role: 'user'
        };

        // Generate token (in production, backend does this)
        const token = TokenManager.create(user.id, user.email, user.role);
        
        return { user, token };
    },

    logout: async (): Promise<void> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // In production, this would:
        // 1. Invalidate refresh token on backend
        // 2. Add access token to blacklist/revocation list
        // 3. Clear httpOnly cookie
        
        TokenManager.clear();
    },

    getSession: async (): Promise<User | null> => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Check if we have a valid token
        const token = TokenManager.get();
        if (!token) return null;
        
        // Decode token to get user info
        const payload = TokenManager.decode(token.accessToken);
        if (!payload) {
            TokenManager.clear();
            return null;
        }
        
        // In production, you might call GET /api/auth/me
        // to validate token with backend and get fresh user data
        
        return {
            id: payload.userId,
            email: payload.email,
            name: 'Test User',
            role: payload.role as 'admin' | 'user'
        };
    },
    
    // Refresh token before expiration (proactive refresh)
    refreshSession: async (): Promise<boolean> => {
        const newToken = await TokenManager.refresh();
        return newToken !== null;
    }
};
