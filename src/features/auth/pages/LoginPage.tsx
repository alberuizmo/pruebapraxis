import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-financial-primary rounded-lg flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Praxis Financial</h1>
                    <p className="text-slate-500 mt-2">Secure Transaction Management</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
};
