import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "NGN"): string {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 0, // Optional: if you don't want to show kobo for whole numbers
    maximumFractionDigits: 2, // Standard for currency
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    return "Invalid Date";
  }
}
