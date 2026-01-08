import { useAccounts, useSelectedAccount } from "../hooks/useAccounts";
import { BalanceCard } from "../components/BalanceCard";
import { AccountSelector } from "../components/AccountSelector";
import { TransactionsTable } from "@/features/transactions/components/TransactionsTable";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

export const DashboardPage = () => {
    const { data: accounts, isLoading } = useAccounts();
    const { selectedAccount, setSelectedAccountId } = useSelectedAccount(accounts);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <AccountSelector 
                    accounts={accounts} 
                    selectedId={selectedAccount?.id} 
                    onSelect={setSelectedAccountId}
                    isLoading={isLoading}
                />
                
                <div className="flex gap-2">
                    <Button variant="outline">Statements</Button>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Transfer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-1">
                    <BalanceCard account={selectedAccount} isLoading={isLoading} />
                </div>
                
                {/* Placeholder for Quick Actions or Charts */}
                <div className="md:col-span-1 lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center items-center text-center space-y-2 opacity-50 border-dashed">
                     <p className="font-medium text-slate-500">Spending Analytics</p>
                     <p className="text-xs text-slate-400">Coming Soon</p>
                </div>
                 <div className="md:col-span-1 lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center items-center text-center space-y-2 opacity-50 border-dashed">
                     <p className="font-medium text-slate-500">Recurring Payments</p>
                     <p className="text-xs text-slate-400">Coming Soon</p>
                </div>
            </div>

            {/* Transactions Section */}
            <TransactionsTable />
        </div>
    );
};
