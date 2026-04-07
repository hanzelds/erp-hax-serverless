import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-DO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function calculateInvoiceTotals(items: {
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxExempt: boolean;
}[]) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const taxAmount = items.reduce((sum, i) => {
    if (i.taxExempt) return sum;
    return sum + i.quantity * i.unitPrice * i.taxRate;
  }, 0);
  return {
    subtotal,
    taxAmount,
    total: subtotal + taxAmount,
  };
}

export function generateInvoiceNumber(sequence: number): string {
  return `HAX-${new Date().getFullYear()}-${String(sequence).padStart(5, "0")}`;
}
