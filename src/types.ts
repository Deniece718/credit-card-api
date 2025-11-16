export interface RemainingSpend {
    used: number;
    limit: number;
}

export interface TransactionData {
    id: string;
    description: string;
    amount: number;
    date: Date;
}

export interface CardData {
    id: string;
    isActivated: boolean;
    cardNumber: string;
    remainingSpend: RemainingSpend;
    transactions?: TransactionData[];
}

export interface Company {
    id: string;
    userId: string;
    companyName: string;
}
