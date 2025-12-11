import { Book, WorkshopCountryPrice } from './types';

export const LOGIN_CODE = '561393';
export const RAMON_WHATSAPP_NUMBER = '+1234567890'; // Replace with Ramón's actual number, e.g., '521234567890' for Mexico

export const WORKSHOP_PRICES: Record<string, WorkshopCountryPrice> = {
  Mexico: { price: '2,500 pesos MXN', method: 'Oxxo o transferencia' },
  Colombia: { price: '300,000 pesos COP', method: 'Transferencia bancaria' },
  Peru: { price: '350 soles PEN', method: 'Yape/Plin' },
  Venezuela: { price: '500 bolívares VES', method: 'Transferencia bancaria' },
  Other: { price: '11 dólares USD', method: 'Hotmart' },
};

export const BOOKS_DATA: Book[] = [
  {
    id: 'book1',
    title: 'El Arte de la Persuasión',
    description: 'Aprende las técnicas esenciales para influir positivamente en los demás y alcanzar tus metas. Un best-seller que cambiará tu forma de comunicarte.',
    prices: {
      Mexico: '350 pesos MXN',
      Colombia: '45,000 pesos COP',
      Peru: '60 soles PEN',
      Venezuela: '80 bolívares VES',
      Other: '15 dólares USD',
    },
  },
  {
    id: 'book2',
    title: 'Maestría Financiera',
    description: 'Guía práctica para construir riqueza, manejar deudas y planificar un futuro financiero seguro. Indispensable para tu libertad económica.',
    prices: {
      Mexico: '400 pesos MXN',
      Colombia: '50,000 pesos COP',
      Peru: '70 soles PEN',
      Venezuela: '90 bolívares VES',
      Other: '18 dólares USD',
    },
  },
  {
    id: 'book3',
    title: 'Despierta tu Potencial',
    description: 'Descubre cómo desbloquear tu máximo potencial personal y profesional con estrategias probadas. El manual definitivo para el crecimiento personal.',
    prices: {
      Mexico: '300 pesos MXN',
      Colombia: '40,000 pesos COP',
      Peru: '55 soles PEN',
      Venezuela: '75 bolívares VES',
      Other: '13 dólares USD',
    },
  },
];