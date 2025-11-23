<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="1"
    text-color="#fff"
    :router="true"
    style="height: 100vh; border-right: none"
  >
    <div class="logo-container">
      <h3 class="text-white text-center py-3">ADMIN SHOP</h3>
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
  </el-menu>
</template>

<style scoped>
.logo-container {
  background-color: #434a50;
}
</style>
