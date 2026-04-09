export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    profile: '/auth/me',
  },
  categories: {
    base: '/category',
    getAll: '/getAllCategory',
    getById: '/getCategoryById',
  },
  products: {
    base: '/product',
    getAll: '/getAllProducts',
  },
  orders: {
    base: '/order',
  },
} as const;
