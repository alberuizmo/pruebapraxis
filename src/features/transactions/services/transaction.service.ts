export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Transaction {
    id: string;
    date: string; // ISO
    concept: string;
    amount: number;
    status: TransactionStatus;
    merchant: string;
    category: string;
}

export interface TransactionFilters {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: TransactionStatus | 'ALL';
}

export interface TransactionSort {
    field: 'date' | 'amount';
    direction: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Generate 5000+ Mock Transactions
const generateTransactions = (count: number): Transaction[] => {
    const transactions: Transaction[] = [];
    const statuses: TransactionStatus[] = ['PENDING', 'CONFIRMED', 'FAILED'];
    const concepts = ['Amazon Purchase', 'Netflix Subscription', 'Uber Ride', 'Salary Deposit', 'Grocery Store', 'Electric Bill', 'Gym Membership', 'Coffee Shop', 'Freelance Payment', 'Restaurant Dinner'];
    
    for (let i = 0; i < count; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        
        transactions.push({
            id: `txn_${i + 1}`,
            date: date.toISOString(),
            concept: concepts[Math.floor(Math.random() * concepts.length)],
            amount: Number((Math.random() * 500).toFixed(2)) * (Math.random() > 0.3 ? -1 : 1), // Mixed income and expense
            status: statuses[Math.floor(Math.random() * statuses.length)],
            merchant: `Merchant ${Math.floor(Math.random() * 100)}`,
            category: 'General'
        });
    }
    // Sort initially by date desc
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Singleton Mock Database
const MOCK_DB = generateTransactions(5000);

export const TransactionService = {
    getTransactions: async (
        page: number = 1, 
        pageSize: number = 10, 
        filters?: TransactionFilters,
        sort?: TransactionSort
    ): Promise<PaginatedResult<Transaction>> => {
        // Simulate Network Latency
        await new Promise(resolve => setTimeout(resolve, 600));

        let result = [...MOCK_DB];

        // 1. Filtering
        if (filters) {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                result = result.filter(t => 
                    t.concept.toLowerCase().includes(searchLower) || 
                    t.merchant.toLowerCase().includes(searchLower)
                );
            }
            if (filters.status && filters.status !== 'ALL') {
                result = result.filter(t => t.status === filters.status);
            }
            if (filters.startDate) {
                const start = new Date(filters.startDate).getTime();
                result = result.filter(t => new Date(t.date).getTime() >= start);
            }
            if (filters.endDate) {
                const end = new Date(filters.endDate).getTime();
                result = result.filter(t => new Date(t.date).getTime() <= end);
            }
        }

        // 2. Sorting
        if (sort) {
            result.sort((a, b) => {
                let valA: number | string = a[sort.field];
                let valB: number | string = b[sort.field];

                if (sort.field === 'date') {
                    valA = new Date(valA).getTime();
                    valB = new Date(valB).getTime();
                } else if (sort.field === 'amount') {
                     valA = Math.abs(a.amount); // Sort by magnitude or actual value? Usually value for amount.
                }

                if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // 3. Pagination
        const total = result.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const data = result.slice(startIndex, endIndex);

        return {
            data,
            total,
            page,
            pageSize,
            totalPages
        };
    }
};
