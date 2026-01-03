<template>
  <el-menu
    active-text-color="#409EFF"
    background-color="#304156"
    class="el-menu-vertical-demo"
    default-active="1"
    text-color="#bfcbd9"
    :router="true"
    style="height: 100vh; border-right: none"
  >
    <div class="logo-container">
      <h3 class="text-center py-3 m-0" style="color: #fff; font-weight: bold; letter-spacing: 1px">
        <el-icon style="margin-right: 8px; vertical-align: middle"><UserFilled /></el-icon> VPP-Quản
        Lý
      </h3>
    </div>

    <el-menu-item index="/dashboard">
      <el-icon><Odometer /></el-icon>
      <span>Thống kê</span>
    </el-menu-item>

    <el-sub-menu index="2">
      <template #title>
        <el-icon><Box /></el-icon>
        <span>Quản lý Sản phẩm</span>
      </template>
      <el-menu-item index="/products">Tất cả sản phẩm</el-menu-item>
      <el-menu-item index="/categories">Danh mục</el-menu-item>
      <el-menu-item index="/brands">Thương hiệu</el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/orders">
      <el-icon><List /></el-icon>
      <span>Đơn hàng</span>
    </el-menu-item>

    <el-menu-item index="/imports">
      <el-icon><Van /></el-icon>
      <span>Nhập kho</span>
    </el-menu-item>

    <el-sub-menu index="5">
      <template #title>
        <el-icon><User /></el-icon>
        <span>Người dùng</span>
      </template>
      <el-menu-item index="/customers">Khách hàng</el-menu-item>
      <el-menu-item index="/staffs">Nhân viên</el-menu-item>
    </el-sub-menu>
    <!-- --- THÊM MENU CHAT VÀO  --- -->
    <el-menu-item index="/chat">
      <el-icon><ChatDotRound /></el-icon>
      <!-- Icon chat -->
      <span>Hỗ trợ trực tuyến</span>
    </el-menu-item>
    <!-- ------------------------------ -->
  </el-menu>
</template>

<style scoped>
.logo-container {
  background-color: #2b3648;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
