import { defineStore } from 'pinia'
import { ref } from 'vue'
import AuthService from '@/services/auth.service'

export const useAuthStore = defineStore('admin-auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('admin_user'))) // Lưu key khác đi: admin_user

  async function login(email, mat_khau) {
    const userData = await AuthService.login({ email, mat_khau })
    user.value = userData
    localStorage.setItem('admin_user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('admin_user')
  }

  return { user, login, logout }
})
