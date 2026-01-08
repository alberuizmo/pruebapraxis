import { useTransactions } from "../hooks/useTransactions";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import type { TransactionStatus } from "../services/transaction.service";
import { ChevronLeft, ChevronRight, ArrowUpDown, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { TransactionDetail } from "./TransactionDetail";
import { clsx } from "clsx";

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
    const styles = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-200",
        FAILED: "bg-red-100 text-red-800 border-red-200"
    };

    return (
        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status])}>
            {status}
        </span>
    );
};

const SortIcon = ({ field, currentSort }: { field: 'date' | 'amount'; currentSort: { field: string; direction: string } }) => {
    if (currentSort.field !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />;
    return currentSort.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-financial-primary" /> : <ArrowDown className="h-3 w-3 text-financial-primary" />;
};

export const TransactionsTable = () => {
    const { 
        data: result, 
        isLoading, 
        isPlaceholderData,
        page, 
        setPage, 
        setFilters,
        sort,
        setSort 
    } = useTransactions();

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchTerm }));
        setPage(1);
    };

    const toggleSort = (field: 'date' | 'amount') => {
        setSort(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium'
    });

    const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

    return (
        <>
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-900">Recent Transactions</CardTitle>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                            <Input 
                                placeholder="Search transactions..." 
                                className="h-9 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button type="submit" size="sm" variant="secondary">Filter</Button>
                        </form>
                        <select 
                            className="h-9 rounded-md border border-slate-300 text-sm px-3 focus:ring-2 focus:ring-financial-primary outline-none"
                            onChange={(e) => {
                                const val = e.target.value;
                                setFilters(prev => ({ ...prev, status: val === 'ALL' ? undefined : val as TransactionStatus }));
                                setPage(1);
                            }}
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('date')}>
                                        <div className="flex items-center gap-1">Date <SortIcon field="date" currentSort={sort}/></div>
                                    </th>
                                    <th className="px-6 py-3">Concept / Merchant</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('amount')}>
                                        <div className="flex items-center justify-end gap-1">Amount <SortIcon field="amount" currentSort={sort}/></div>
                                    </th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20 ml-auto"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                ) : result?.data.map((txn: any) => (
                                    <tr 
                                        key={txn.id} 
                                        className="bg-white hover:bg-slate-50 transition-colors group cursor-pointer"
                                        onClick={() => setSelectedTxn(txn)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                            {dateFormatter.format(new Date(txn.date))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900">{txn.concept}</p>
                                            <p className="text-xs text-slate-500">{txn.merchant}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={txn.status} />
                                        </td>
                                        <td className={clsx("px-6 py-4 text-right font-medium whitespace-nowrap", {
                                            "text-emerald-600": txn.amount > 0,
                                            "text-slate-900": txn.amount <= 0
                                        })}>
                                            {txn.amount > 0 ? "+" : ""}{currencyFormatter.format(txn.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="text-xs text-slate-500">
                            Page <span className="font-medium">{page}</span> of <span className="font-medium">{result?.totalPages || 1}</span>
                            <span className="hidden sm:inline"> ({result?.total} total)</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => (!result || isPlaceholderData || page >= result.totalPages ? p : p + 1))}
                                disabled={!result || page >= result.totalPages || isLoading}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Sheet 
                isOpen={!!selectedTxn} 
                onClose={() => setSelectedTxn(null)} 
                title="Transaction Details"
            >
                {selectedTxn && <TransactionDetail transaction={selectedTxn} />}
            </Sheet>
        </>
    );
};
