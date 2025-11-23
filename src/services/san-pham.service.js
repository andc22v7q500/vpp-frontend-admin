import createApiClient from './api.service'
// import { useAuthStore } from '@/stores/auth.store'

class SanPhamService {
  constructor(baseUrl = '/api/san-pham') {
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
  async get(id) {
    return (await this.api.get(`/${id}`)).data
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

  // --- MẪU MÃ ---
  async createVariant(productId, data) {
    return (await this.api.post(`/${productId}/mau-ma`, data)).data
  }
  // (Lưu ý: Update và Delete mẫu mã dùng route khác: /api/mau-ma/:id)
  // Chúng ta cần tạo thêm MauMaService riêng hoặc gọi trực tiếp axios nếu lười
  // Để chuẩn, ta nên tạo MauMaService riêng, nhưng tạm thời anh/chị sẽ gộp logic vào đây cho gọn
  async uploadImages(id, formData) {
    return (
      await this.api.post(`/${id}/hinh-anh`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data
  }
}

export default new SanPhamService()
