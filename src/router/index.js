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
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatManager.vue'),
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
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
      component: () => import('../views/products/ProductForm.vue'),
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
    {
      path: '/imports',
      name: 'imports',
      component: () => import('../views/imports/ImportList.vue'),
    },
    {
      path: '/imports/add',
      name: 'import.add',
      component: () => import('../views/imports/ImportForm.vue'),
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/users/CustomerList.vue'),
    },
    {
      path: '/staffs',
      name: 'staffs',
      component: () => import('../views/users/StaffList.vue'),
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
