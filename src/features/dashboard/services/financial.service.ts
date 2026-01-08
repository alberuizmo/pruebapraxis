export interface Account {
    id: string;
    name: string;
    number: string;
    balance: number;
    currency: 'USD' | 'EUR' | 'COP';
    lastUpdated: string; // ISO Date
}

const mockAccounts: Account[] = [
    {
        id: 'acc_1',
        name: 'Main Savings',
        number: '**** 4589',
        balance: 24500.50,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
    },
    {
        id: 'acc_2',
        name: 'Daily Expenses',
        number: '**** 1234',
        balance: 1200.00,
        currency: 'USD',
        lastUpdated: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 'acc_3',
        name: 'Investment',
        number: '**** 9999',
        balance: 50000.00,
        currency: 'EUR',
        lastUpdated: new Date(Date.now() - 86400000).toISOString()
    }
];

export const FinancialService = {
    getAccounts: async (): Promise<Account[]> => {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
        return mockAccounts;
    }
};
