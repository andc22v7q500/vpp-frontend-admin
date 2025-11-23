import createApiClient from './api.service'
// Lưu ý: Chúng ta import từ store của ADMIN
// import { useAuthStore } from '@/stores/auth.store'

class DanhMucService {
  constructor(baseUrl = '/api/danh-muc') {
    this.api = createApiClient(baseUrl)
    this.api.interceptors.request.use((config) => {
      // const authStore = useAuthStore()
      const user = JSON.parse(localStorage.getItem('admin_user')) // Lấy user từ localStorage
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

export default new DanhMucService()
