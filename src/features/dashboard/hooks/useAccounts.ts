import { useQuery } from "@tanstack/react-query";
import { FinancialService } from "../services/financial.service";
import { useState } from "react";

export const useAccounts = () => {
    return useQuery({
        queryKey: ['financial', 'accounts'],
        queryFn: FinancialService.getAccounts,
    });
};

// Simple hook to manage selected account state locally for now
// In a real app, this might be in a global store if needed by many components
export const useSelectedAccount = (accounts: any[] | undefined) => {
    const [selectedLikelyId, setSelected] = useState<string | null>(null);

    const selectedAccount = accounts?.find(a => a.id === selectedLikelyId) || accounts?.[0] || null;

    return {
        selectedAccount,
        setSelectedAccountId: setSelected
    };
};
