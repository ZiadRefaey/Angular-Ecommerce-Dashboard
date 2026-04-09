export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    profile: '/auth/me',
  },
  categories: {
    base: '/category',
    createCategory: '/createCategory',
    getAll: '/getAllCategory',
    getById: '/getCategoryById',
  },
  products: {
    base: '/product',
    getAll: '/getAllProducts',
    getById: '/getProductById',
    createProduct: '/createProduct',
    updateProduct: '/updateProduct',
  },
  orders: {
    base: '/order',
  },
} as const;
