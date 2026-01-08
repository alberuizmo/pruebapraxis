import type { Transaction } from "@/features/transactions/services/transaction.service";

interface TransactionDetailProps {
    transaction: Transaction;
}

export const TransactionDetail = ({ transaction }: TransactionDetailProps) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium'
    });

    return (
        <div className="space-y-6">
            <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Amount</p>
                <p className={`text-3xl font-bold ${transaction.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {formatter.format(transaction.amount)}
                </p>
                <p className={`mt-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${transaction.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                      transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                      'bg-red-100 text-red-800 border-red-200'}`}>
                    {transaction.status}
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-slate-900 border-b border-slate-100 pb-2">Details</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">Transaction ID</p>
                        <p className="font-medium text-slate-900 truncate" title={transaction.id}>{transaction.id}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Category</p>
                        <p className="font-medium text-slate-900">{transaction.category}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-slate-500">Merchant</p>
                        <p className="font-medium text-slate-900">{transaction.merchant}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-slate-500">Description</p>
                        <p className="font-medium text-slate-900">{transaction.concept}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-slate-500">Date & Time</p>
                        <p className="font-medium text-slate-900">{dateFormatter.format(new Date(transaction.date))}</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
                <p className="font-medium">Note</p>
                <p className="mt-1 opacity-90">This is a simulated transaction details view. In a real app, this would fetch more data from the API.</p>
            </div>
        </div>
    );
};
