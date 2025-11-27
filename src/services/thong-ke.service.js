import createApiClient from './api.service'
// import { useAuthStore } from '@/stores/auth.store'

class ThongKeService {
  constructor(baseUrl = '/api/admin/thong-ke') {
    this.api = createApiClient(baseUrl)
    this.api.interceptors.request.use((config) => {
      const user = JSON.parse(localStorage.getItem('admin_user'))
      if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`
      }
      return config
    })
  }

  async getOverview() {
    return (await this.api.get('/tong-quan')).data
  }

  async getDailyRevenue(startDate, endDate) {
    return (await this.api.get(`/doanh-thu?start=${startDate}&end=${endDate}`)).data
  }
}

export default new ThongKeService()
