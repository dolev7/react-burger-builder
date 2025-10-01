// Application constants and configuration

export const APP_CONFIG = {
  name: 'MyBurger',
  version: '1.0.0',
  description: 'Build your perfect burger'
} as const;

export const ROUTES = {
  HOME: '/',
  CHECKOUT: '/checkout',
  ORDERS: '/orders'
} as const;

export const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
} as const;

export const BASE_BURGER_PRICE = 4;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered'
} as const;
