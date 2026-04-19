export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    profile: '/auth/me',
    getCurrentUser: '/auth/getMyProfile',
    getAllUsers: '/auth/getAlluser',
    getUserById: '/auth/getUserById',
  },
  categories: {
    base: '/category',
    createCategory: '/createCategory',
    getAll: '/getAllCategory',
    getById: '/getCategoryById',
    deleteById: '/deleteCategory',
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
    getById: '/getOrderById',
    updateStatus: '/updateOrderStatus',
  },
} as const;
