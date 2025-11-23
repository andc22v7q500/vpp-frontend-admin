import createApiClient from './api.service'

class AuthService {
  constructor(baseUrl = '/api/auth') {
    this.api = createApiClient(baseUrl)
  }
  async login(data) {
    // Gọi đến API đăng nhập dành cho NHÂN VIÊN
    return (await this.api.post('/nhan-vien/signin', data)).data
  }
}
export default new AuthService()
