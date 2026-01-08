export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

// Simulate In-Memory Session
let currentSession: User | null = null;

export const AuthService = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Strict Validation
        if (credentials.email !== 'test@example.com' || credentials.password !== 'password123') {
            throw new Error("Invalid credentials");
        }
        
        // Mock User
        const user: User = {
            id: 'u_123',
            email: credentials.email,
            name: 'Test User',
            role: 'user'
        };

        currentSession = user;
        return user;
    },

    logout: async (): Promise<void> => {
       await new Promise(resolve => setTimeout(resolve, 300));
       currentSession = null;
    },

    getSession: async (): Promise<User | null> => {
        // This allows session to persist in memory during app usage, 
        // but would be lost on strict hard refresh if we strictly followed "no localStorage".
        // However, for React Query refetching, this works.
        await new Promise(resolve => setTimeout(resolve, 200));
        return currentSession;
    }
};
