import createApiClient from './api.service'
// import { useAuthStore } from '@/stores/auth.store'

class KhachHangService {
  constructor(baseUrl = '/api/admin/khach-hang') {
    this.api = createApiClient(baseUrl)
    this.api.interceptors.request.use((config) => {
      const user = JSON.parse(localStorage.getItem('admin_user'))
      if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`
      }
      return config
    })
  }

  async getAll() {
    return (await this.api.get('/')).data
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new KhachHangService()
