import createApiClient from './api.service'
// import { useAuthStore } from '@/stores/auth.store'

class MauMaService {
  constructor(baseUrl = '/api/mau-ma') {
    // Base URL khác
    this.api = createApiClient(baseUrl)
    this.api.interceptors.request.use((config) => {
      const user = JSON.parse(localStorage.getItem('admin_user'))
      if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`
      }
      return config
    })
  }

  // Cập nhật mẫu mã: PUT /api/mau-ma/:id
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data
  }

  // Xóa mẫu mã: DELETE /api/mau-ma/:id
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new MauMaService()
