import createApiClient from './api.service'
// import { useAuthStore } from '@/stores/auth.store'

class HinhAnhService {
  constructor(baseUrl = '/api/hinh-anh') {
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

  // Xóa hình ảnh: DELETE /api/hinh-anh/:id
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new HinhAnhService()
