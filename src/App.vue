<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import { computed } from 'vue'

const route = useRoute()

// Nếu đang ở trang Login thì không hiện Sidebar/Header
const isLoginPage = computed(() => route.name === 'login')
</script>

<template>
  <!-- Nếu là trang Login, chỉ hiện nội dung -->
  <div v-if="isLoginPage" class="login-layout">
    <RouterView />
  </div>

  <!-- Nếu là trang Admin, hiện layout đầy đủ -->
  <el-container v-else style="height: 100vh">
    <el-aside width="250px">
      <AppSidebar />
    </el-aside>

    <el-container>
      <el-header style="padding: 0">
        <AppHeader />
      </el-header>

      <el-main style="background-color: #f0f2f5">
        <!-- Nội dung từng trang sẽ hiện ở đây -->
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
}
</style>
