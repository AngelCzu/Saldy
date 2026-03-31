import { SharedExpenseData } from "./shared-expense.model";

export type TransactionType = 'income' | 'expense';
export type Currency = 'clp' | 'uf';


export interface SubmitMovementData {
  type: TransactionType;
  title: string;
  amount: number;
  currency: Currency;
  categoryId?: string;

  isShared: boolean;
  sharedData?: SharedExpenseData | null;
  ufValue?: number;
}