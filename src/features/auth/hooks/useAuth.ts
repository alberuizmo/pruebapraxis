import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";

export const useAuth = () => {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ['auth', 'session'],
        queryFn: AuthService.getSession,
        staleTime: Infinity, // Keep session "fresh" indefinitely in memory
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: AuthService.login,
        onSuccess: (newUser) => {
            queryClient.setQueryData(['auth', 'session'], newUser);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: AuthService.logout,
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'session'], null);
        },
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutateAsync, // Expose async for form handling
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
    };
};
