import type { Account } from "../services/financial.service";
import { cn } from "@/lib/utils";
import { ChevronDown, Wallet } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AccountSelectorProps {
    accounts: Account[] | undefined;
    selectedId: string | undefined;
    onSelect: (id: string) => void;
    isLoading: boolean;
}

export const AccountSelector = ({ accounts, selectedId, onSelect, isLoading }: AccountSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedAccount = accounts?.find(a => a.id === selectedId);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLoading) {
         return <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />;
    }

    if (!accounts || accounts.length === 0) return null;

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
                <div className="h-8 w-8 bg-financial-accent/10 text-financial-accent rounded flex items-center justify-center">
                    <Wallet className="h-4 w-4" />
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-xs text-slate-500">Active Account</p>
                    <p className="text-sm font-medium text-slate-900 leading-none">
                        {selectedAccount?.name || "Select Account"}
                    </p>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1">
                        {accounts.map(account => (
                            <button
                                key={account.id}
                                onClick={() => {
                                    onSelect(account.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                    account.id === selectedId 
                                        ? "bg-slate-50" 
                                        : "hover:bg-slate-50"
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded flex items-center justify-center",
                                    account.id === selectedId ? "bg-financial-primary text-white" : "bg-slate-100 text-slate-500"
                                )}>
                                    <span className="text-xs font-bold">{account.currency}</span>
                                </div>
                                <div>
                                    <p className={cn("text-sm font-medium", account.id === selectedId ? "text-slate-900" : "text-slate-700")}>
                                        {account.name}
                                    </p>
                                    <p className="text-xs text-slate-500">{account.number}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
