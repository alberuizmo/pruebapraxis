import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import type { Account } from "@/types";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
    account: Account | null;
    isLoading: boolean;
}

export const BalanceCard = ({ account, isLoading }: BalanceCardProps) => {
    const [isVisible, setIsVisible] = useState(true);

    if (isLoading) {
        return (
            <Card className="h-40 animate-pulse bg-slate-100 border-slate-200">
                <CardContent className="h-full" />
            </Card>
        );
    }

    if (!account) return null;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: account.currency,
    });

    return (
        <Card className="bg-financial-primary text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                    Total Balance
                </CardTitle>
                <div className="flex items-center gap-2">
                     <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-slate-300 hover:text-white hover:bg-white/10"
                        onClick={() => setIsVisible(!isVisible)}
                     >
                        {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                     </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                    {isVisible ? formatter.format(account.balance) : "••••••••"}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{account.name} ({account.number})</span>
                    <div className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        <span>Updated just now</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
