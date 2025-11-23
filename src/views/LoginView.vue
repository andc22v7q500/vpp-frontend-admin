<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  mat_khau: '',
})

const rules = {
  email: [{ required: true, message: 'Vui lòng nhập Email', trigger: 'blur' }],
  mat_khau: [{ required: true, message: 'Vui lòng nhập Mật khẩu', trigger: 'blur' }],
}

const formRef = ref(null)

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await authStore.login(form.email, form.mat_khau)
        ElMessage.success('Đăng nhập thành công')
        router.push('/dashboard')
      } catch (error) {
        console.error(error)
        ElMessage.error('Đăng nhập thất bại. Vui lòng kiểm tra lại.')
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="text-center">Admin Login</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Nhập email" />
        </el-form-item>
        <el-form-item label="Mật khẩu" prop="mat_khau">
          <el-input
            v-model="form.mat_khau"
            type="password"
            placeholder="Nhập mật khẩu"
            show-password
          />
        </el-form-item>
        <el-button type="primary" class="w-100" @click="handleLogin">Đăng nhập</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
.login-card {
  width: 400px;
}
.text-center {
  text-align: center;
}
.w-100 {
  width: 100%;
}
</style>
