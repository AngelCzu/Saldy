import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrencyService {

  parseCLP(value: string): number | null {
    const numeric = value.replace(/\D/g, '');
    return numeric ? Number(numeric) : null;
  }

  parseUF(value: string): number | null {
    const sanitizedValue = value.replace(/[^\d.,]/g, '');
    const lastCommaIndex = sanitizedValue.lastIndexOf(',');

    if (lastCommaIndex >= 0) {
      const integerPart = sanitizedValue.slice(0, lastCommaIndex).replace(/[^\d]/g, '');
      const decimalPart = sanitizedValue.slice(lastCommaIndex + 1).replace(/[^\d]/g, '');

      const normalizedNumber = decimalPart
        ? `${integerPart || '0'}.${decimalPart}`
        : integerPart;

      return normalizedNumber ? Number(normalizedNumber) : null;
    }

    const integerPart = sanitizedValue.replace(/[^\d]/g, '');
    return integerPart ? Number(integerPart) : null;
  }

  calculateCLPFromUF(ufAmount: number, ufValue: number): number {
    return Math.round(ufAmount * ufValue);
  }

  formatCLP(value: number): string {
    return new Intl.NumberFormat('es-CL').format(value);
  }

  formatUF(value: number): string {
    const [integerPart, decimalPart = ''] = value.toString().split('.');

    const formattedInteger = new Intl.NumberFormat('es-CL').format(parseInt(integerPart, 10));

    return decimalPart
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
  }

  async getUF(): Promise<number> {
    // temporal (puedes cambiarlo luego por API real)
    return 37850;
  }
}