<script setup>
import { ref, onMounted, computed } from 'vue'
import DonHangService from '@/services/don-hang.service'
import { ElMessage, ElMessageBox } from 'element-plus'

const orders = ref([])

// Hàm format tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// Hàm format ngày giờ
const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

// Helper để hiển thị trạng thái đẹp hơn
const getStatusTag = (status) => {
  switch (status) {
    case 'cho_xac_nhan':
      return 'warning'
    case 'dang_xu_ly':
      return 'primary'
    case 'dang_giao':
      return 'info'
    case 'hoan_thanh':
      return 'success'
    case 'da_huy':
      return 'danger'
    default:
      return 'info'
  }
}

const getStatusText = (status) => {
  const map = {
    cho_xac_nhan: 'Chờ xác nhận',
    dang_xu_ly: 'Đang xử lý',
    dang_giao: 'Đang giao',
    hoan_thanh: 'Hoàn thành',
    da_huy: 'Đã hủy',
  }
  return map[status] || status
}

// Lấy dữ liệu
const fetchOrders = async () => {
  try {
    orders.value = await DonHangService.getAll()
  } catch (error) {
    console.error(error)
    ElMessage.error('Lỗi khi tải danh sách đơn hàng')
  }
}

// Xử lý cập nhật trạng thái nhanh
const handleUpdateStatus = async (row, newStatus) => {
  try {
    await DonHangService.updateStatus(row.id, newStatus)
    ElMessage.success(`Cập nhật trạng thái thành công: ${getStatusText(newStatus)}`)
    fetchOrders() // Tải lại để cập nhật giao diện
  } catch (error) {
    ElMessage.error('Lỗi khi cập nhật trạng thái')
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div>
    <h2>Quản lý Đơn hàng</h2>

    <el-table :data="orders" border stripe style="width: 100%">
      <el-table-column prop="id" label="Mã đơn" width="80" align="center" />

      <el-table-column label="Khách hàng">
        <template #default="scope">
          <div>{{ scope.row.ten_khach_hang }}</div>
          <small class="text-muted">ID: {{ scope.row.ma_khach_hang }}</small>
        </template>
      </el-table-column>

      <el-table-column label="Tổng tiền" width="150">
        <template #default="scope">
          <span style="color: #f56c6c; font-weight: bold">{{
            formatCurrency(scope.row.tong_tien)
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Ngày đặt" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.ngay_dat) }}
        </template>
      </el-table-column>

      <el-table-column label="Trạng thái" width="150" align="center">
        <template #default="scope">
          <el-tag :type="getStatusTag(scope.row.trang_thai)">
            {{ getStatusText(scope.row.trang_thai) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Hành động" width="250">
        <template #default="scope">
          <!-- Nút Duyệt đơn (Chỉ hiện khi Chờ xác nhận) -->
          <el-button
            v-if="scope.row.trang_thai === 'cho_xac_nhan'"
            size="small"
            type="success"
            @click="handleUpdateStatus(scope.row, 'dang_xu_ly')"
          >
            Duyệt đơn
          </el-button>

          <!-- Nút Giao hàng (Chỉ hiện khi Đang xử lý) -->
          <el-button
            v-if="scope.row.trang_thai === 'dang_xu_ly'"
            size="small"
            type="primary"
            @click="handleUpdateStatus(scope.row, 'dang_giao')"
          >
            Giao hàng
          </el-button>

          <!-- Nút Hoàn thành (Chỉ hiện khi Đang giao) -->
          <el-button
            v-if="scope.row.trang_thai === 'dang_giao'"
            size="small"
            type="success"
            plain
            @click="handleUpdateStatus(scope.row, 'hoan_thanh')"
          >
            Hoàn thành
          </el-button>

          <!-- Nút Hủy (Chỉ hiện khi chưa hoàn thành/hủy) -->
          <el-button
            v-if="['cho_xac_nhan', 'dang_xu_ly'].includes(scope.row.trang_thai)"
            size="small"
            type="danger"
            plain
            @click="handleUpdateStatus(scope.row, 'da_huy')"
          >
            Hủy
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
