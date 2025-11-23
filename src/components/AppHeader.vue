<script setup>
import { useRouter } from 'vue-router'
// import { useAuthStore } from '@/stores/auth.store' // Sẽ tạo sau

const router = useRouter()
// const authStore = useAuthStore();

const handleLogout = () => {
  // authStore.logout();
  router.push('/login')
}
</script>

<template>
  <div class="header-container">
    <div class="left">
      <!-- Có thể thêm breadcrumb ở đây -->
    </div>
    <div class="right">
      <el-dropdown>
        <span class="el-dropdown-link">
          Xin chào, Admin
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">Đăng xuất</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
