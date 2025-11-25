import createApiClient from './api.service'
// import { useAuthStore } from '@/stores/auth.store'

class PhieuNhapService {
  constructor(baseUrl = '/api/admin/phieu-nhap') {
    // URL API Admin
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

  // data: { ghi_chu: "...", chi_tiet: [{ ma_mau_ma: 1, so_luong_nhap: 10, gia_nhap: 5000 }] }
  async create(data) {
    return (await this.api.post('/', data)).data
  }
}

export default new PhieuNhapService()
