export type Screen = 'login' | 'dashboard' | 'workshop' | 'books' | 'payment' | 'bookDetail';

export interface WorkshopCountryPrice {
  price: string;
  method: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  prices: Record<string, string>; // Maps country name to price string
}

export enum PaymentType {
  WORKSHOP = 'Taller',
  BOOK = 'Libro',
}

export interface PaymentDetails {
  type: PaymentType | null;
  fullName: string;
  identification: string;
  screenshot: File | null;
  country: string | null; // Added to help Gemini generate a better message
  itemTitle: string | null; // Added to help Gemini generate a better message
}