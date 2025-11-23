import createApiClient from './api.service'
// import { useAuthStore } from '@/stores/auth.store'

class ThuongHieuService {
  constructor(baseUrl = '/api/thuong-hieu') {
    this.api = createApiClient(baseUrl)
    this.api.interceptors.request.use((config) => {
      // Logic lấy token giống hệt danh mục
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
  async create(data) {
    return (await this.api.post('/', data)).data
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new ThuongHieuService()
