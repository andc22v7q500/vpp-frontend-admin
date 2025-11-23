import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard', // Mặc định vào dashboard
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    // Chúng ta sẽ thêm route Login sau
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'), // Sẽ tạo sau
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryView.vue'),
    },
    {
      path: '/brands',
      name: 'brands',
      component: () => import('../views/BrandView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/products/ProductList.vue'),
    },
    {
      path: '/products/add',
      name: 'product.add',
      component: () => import('../views/products/ProductForm.vue'), // File này sẽ tạo ở bước sau
    },
    {
      path: '/products/edit/:id',
      name: 'product.edit',
      component: () => import('../views/products/ProductForm.vue'),
      props: true,
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/OrderList.vue'),
    },
  ],
})
router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('admin_user')

  if (authRequired && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})
export default router
