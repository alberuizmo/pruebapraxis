import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const loginSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

type LoginFormValues = yup.InferType<typeof loginSchema>;

export const LoginForm = () => {
  const { t } = useTranslation();
  const { login, isLoggingIn, loginError } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      await login({ email: data.email, password: data.password });
      navigate("/dashboard");
    } catch (err) {
        setServerError("Invalid credentials");
        console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-slate-100">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-financial-primary">
          {t('auth.welcome')}
        </CardTitle>
        <p className="text-sm text-slate-500">
          {t('auth.emailPlaceholder')}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              label={t('auth.email')}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              label={t('auth.password')}
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
            
          {(loginError || serverError) && (
              <div className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded">
                  {serverError || "An error occurred during login"}
              </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-financial-primary hover:bg-financial-secondary"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? t('common.loading') : t('auth.loginButton')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
          <p className="text-xs text-slate-400">
              Demo Credentials: test@example.com / password123
          </p>
      </CardFooter>
    </Card>
  );
};
