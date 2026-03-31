import { RegisterMovementCommand } from '../application/register-movement.usecase';

type UIType = 'income' | 'expense';
type UICurrency = 'clp' | 'uf';

type UIForm = {
  type: UIType;
  title: string;
  categoryId?: string;
  currency: UICurrency;
  amount: number;
  ufValue?: number;
  isShared?: boolean;
};

const typeMap: Record<UIType, RegisterMovementCommand['type']> = {
  income: 'INCOME',
  expense: 'EXPENSE',
};

const currencyMap: Record<UICurrency, 'CLP' | 'UF'> = {
  clp: 'CLP',
  uf: 'UF',
};

export function buildMovementCommand(form: UIForm): RegisterMovementCommand {

  // 🔹 Validación mínima (NO negocio)
  if (!form || !form.title) {
    throw new Error('Invalid form');
  }

  // 🔹 Map seguro de type
  const mappedType = typeMap[form.type];
  if (!mappedType) {
    throw new Error('Invalid movement type');
  }

  // 🔹 Map seguro de currency
  const mappedCurrency = currencyMap[form.currency];
  if (!mappedCurrency) {
    throw new Error('Invalid currency');
  }

  const base = {
    type: mappedType,
    title: form.title.trim(),
    categoryId: form.categoryId || undefined,
  };

  // 🔹 CLP
  if (mappedCurrency === 'CLP') {
    return {
      ...base,
      currency: 'CLP',
      amountCLP: form.amount,
      isShared: form.isShared
    };
  }

  // 🔹 UF
  if (form.ufValue == null) {
    throw new Error('ufValue requerido');
  }

  const ufValue = form.ufValue;

  if (!Number.isFinite(ufValue) || ufValue <= 0) {
    throw new Error('Invalid ufValue');
  }

  return {
    ...base,
    currency: 'UF',
    inputAmount: form.amount,
    ufValue: form.ufValue,
    isShared: form.isShared
  };
}