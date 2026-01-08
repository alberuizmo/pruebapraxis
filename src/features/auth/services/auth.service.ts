export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

export interface LoginCredentials {
    email: string;
}

// Simulate In-Memory Session
let currentSession: User | null = null;

export const AuthService = {
    login: async (email: string): Promise<User> => {
        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Validation
        if (!email.includes('@')) {
            throw new Error("Invalid email format");
        }
        
        // Mock User
        const user: User = {
            id: 'u_123',
            email,
            name: email.split('@')[0],
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
