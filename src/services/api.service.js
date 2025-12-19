// src/services/api.service.js (Dành cho Admin)
import axios from 'axios'

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

export default (baseURL) => {
  // 1. Tạo instance
  const instance = axios.create({
    baseURL,
    ...commonConfig,
  })

  // 2. Interceptor xử lý lỗi phản hồi (Response)
  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response) {
        // Nếu lỗi 401 (Hết hạn token) và không phải đang ở trang login
        if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
          console.warn('Phiên làm việc hết hạn. Đang đăng xuất...')

          // Xóa thông tin Admin trong localStorage
          localStorage.removeItem('admin_user')

          // Chuyển hướng về trang login và reload
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    },
  )

  return instance
}
