export interface SharedExpenseData {
  divisionType: 'percentage' | 'clp';
  totalAmount: number;
  participants: {
    id: string;
    name: string;
    isCurrentUser: boolean;
    amount: number;
    clpAmount: number;
  }[];
}