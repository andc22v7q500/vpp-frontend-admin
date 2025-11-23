import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 1. Import Element Plus và CSS của nó
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 2. Import tất cả icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus) // 3. Sử dụng Element Plus

// 4. Đăng ký tất cả icon để dùng ở mọi nơi
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
