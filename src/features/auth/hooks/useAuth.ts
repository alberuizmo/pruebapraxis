import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import { TokenManager } from "@/lib/auth-tokens";
import { useEffect } from "react";

export const useAuth = () => {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ['auth', 'session'],
        queryFn: AuthService.getSession,
        staleTime: 5 * 60 * 1000, // 5 minutes (re-validate periodically)
        retry: false,
        // Refetch on window focus to catch expired tokens
        refetchOnWindowFocus: true,
    });

    const loginMutation = useMutation({
        mutationFn: AuthService.login,
        onSuccess: (response) => {
            // Only store user data in cache, token is in sessionStorage
            queryClient.setQueryData(['auth', 'session'], response.user);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'session'], null);
            queryClient.clear(); // Clear all cached data on logout
        },
    });

    // Auto-refresh token before expiration (production pattern)
    useEffect(() => {
        if (!user) return;

        // Check token validity every minute
        const interval = setInterval(() => {
            const token = TokenManager.get();
            
            if (!token) {
                // Token expired or invalid, force logout
                queryClient.setQueryData(['auth', 'session'], null);
                return;
            }
            
            // If token expires in less than 5 minutes, refresh it
            const timeUntilExpiry = token.expiresAt - Date.now();
            if (timeUntilExpiry < 5 * 60 * 1000) {
                AuthService.refreshSession().then((success) => {
                    if (!success) {
                        // Refresh failed, logout user
                        queryClient.setQueryData(['auth', 'session'], null);
                    }
                });
            }
        }, 60 * 1000); // Check every minute

        return () => clearInterval(interval);
    }, [user, queryClient]);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
    };
};
