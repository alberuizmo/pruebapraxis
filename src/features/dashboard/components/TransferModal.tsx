import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui";
import type { Account } from "@/types";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAccount: Account | null;
    accounts: Account[] | undefined;
}

export const TransferModal = ({ isOpen, onClose, currentAccount, accounts }: TransferModalProps) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState("");
    const [destinationId, setDestinationId] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const availableAccounts = accounts?.filter(acc => acc.id !== currentAccount?.id) || [];

    const handleTransfer = () => {
        // Mock functionality - simulate transfer
        setShowSuccess(true);
        
        // Reset after 2 seconds
        setTimeout(() => {
            setShowSuccess(false);
            setAmount("");
            setDestinationId("");
            onClose();
        }, 2000);
    };

    const isValidTransfer = amount && parseFloat(amount) > 0 && destinationId;

    if (showSuccess) {
        return (
            <Sheet isOpen={isOpen} onClose={onClose} title={t('transfer.title')}>
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                    <h3 className="text-xl font-semibold text-slate-900">{t('transfer.successTitle')}</h3>
                    <p className="text-slate-600">
                        ${parseFloat(amount).toFixed(2)} {t('transfer.successMessage')}
                    </p>
                </div>
            </Sheet>
        );
    }

    return (
        <Sheet isOpen={isOpen} onClose={onClose} title={t('transfer.title')}>
            <div className="space-y-6">
                {/* From Account */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">{t('transfer.fromAccount')}</label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-medium text-slate-900">{currentAccount?.name}</p>
                        <p className="text-sm text-slate-500">{currentAccount?.number}</p>
                        <p className="text-lg font-semibold text-slate-900 mt-2">
                            ${currentAccount?.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex justify-center">
                    <ArrowRight className="h-6 w-6 text-slate-400" />
                </div>

                {/* To Account */}
                <div className="space-y-2">
                    <label htmlFor="destination" className="text-sm font-medium text-slate-700">
                        {t('transfer.toAccount')}
                    </label>
                    <select
                        id="destination"
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    >
                        <option value="">{t('transfer.selectDestination')}</option>
                        {availableAccounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name} - {account.number}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium text-slate-700">
                        {t('transfer.amount')}
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                            $
                        </span>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={t('transfer.amountPlaceholder')}
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg"
                        />
                    </div>
                </div>

                {/* Error if amount is invalid */}
                {amount && parseFloat(amount) <= 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{t('transfer.errorInvalidAmount')}</p>
                    </div>
                )}

                {/* Warning if insufficient balance */}
                {amount && parseFloat(amount) > 0 && parseFloat(amount) > (currentAccount?.balance || 0) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{t('transfer.errorInsufficientBalance')}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handleTransfer}
                        disabled={!isValidTransfer || parseFloat(amount) > (currentAccount?.balance || 0)}
                    >
                        {t('transfer.transferButton')} ${amount || "0.00"}
                    </Button>
                </div>
            </div>
        </Sheet>
    );
};
