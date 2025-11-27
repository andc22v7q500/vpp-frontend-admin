import createApiClient from './api.service'
// import { useAuthStore } from '@/stores/auth.store'

class DonHangService {
  constructor(baseUrl = '/api/admin/don-hang') {
    // Lưu ý: URL là /api/admin/don-hang
    this.api = createApiClient(baseUrl)
    this.api.interceptors.request.use((config) => {
      const user = JSON.parse(localStorage.getItem('admin_user'))
      if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`
      }
      return config
    })
  }

  // Lấy tất cả đơn hàng
  async getAll() {
    return (await this.api.get('/')).data
  }

  // Cập nhật trạng thái đơn hàng
  // PUT /api/admin/don-hang/:id/trang-thai
  async updateStatus(id, status) {
    return (await this.api.put(`/${id}/trang-thai`, { trang_thai: status })).data
  }

  // (Sau này có thể thêm getDetail nếu cần API riêng, nhưng API getAll hiện tại đã trả về khá đủ thông tin chung)
  async getDetail(id) {
    return (await this.api.get(`/${id}`)).data
  }
}

export default new DonHangService()
