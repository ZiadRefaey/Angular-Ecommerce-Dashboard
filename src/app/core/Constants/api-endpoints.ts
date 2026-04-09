export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    profile: '/auth/me',
    getCurrentUser: '/auth/getMyProfile',
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
    getAll: '/getAllOrders',
  },
} as const;
