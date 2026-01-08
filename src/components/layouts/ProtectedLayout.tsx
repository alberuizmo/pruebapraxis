import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui";

export const ProtectedLayout = () => {
    const { user, isLoading, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-financial-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
             {/* Simple Header for now */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-financial-primary rounded flex items-center justify-center text-white font-bold">P</div>
                        <span className="font-semibold text-slate-900">Praxis</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600 mr-2">{user.email}</span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => logout()}
                            className="text-slate-600 hover:text-slate-900 border-slate-200"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};
