<script setup>
import { ref, onMounted, computed } from 'vue'
import DonHangService from '@/services/don-hang.service'
import { ElMessage, ElMessageBox } from 'element-plus'

const orders = ref([])
const dialogVisible = ref(false)
const selectedOrder = ref(null)

// Hàm xem chi tiết
const viewDetail = async (id) => {
  try {
    selectedOrder.value = await DonHangService.getDetail(id)
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('Lỗi khi tải chi tiết đơn hàng')
  }
}

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

      <el-table-column label="Hành động" width="300">
        <template #default="scope">
          <!-- Nút Xem Chi tiết -->
          <el-button size="small" @click="viewDetail(scope.row.id)" style="margin-right: 5px">
            Chi tiết
          </el-button>
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
    <el-dialog v-model="dialogVisible" title="Chi tiết Đơn hàng" width="800px">
      <div v-if="selectedOrder">
        <el-descriptions title="Thông tin chung" :column="2" border>
          <el-descriptions-item label="Mã đơn">#{{ selectedOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="Ngày đặt">{{
            formatDate(selectedOrder.ngay_dat)
          }}</el-descriptions-item>
          <el-descriptions-item label="Khách hàng">{{
            selectedOrder.ten_khach_hang
          }}</el-descriptions-item>
          <el-descriptions-item label="SĐT">{{ selectedOrder.so_dien_thoai }}</el-descriptions-item>
          <el-descriptions-item label="Tổng tiền">
            <span style="color: red; font-weight: bold">{{
              formatCurrency(selectedOrder.tong_tien)
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="Trạng thái">
            <el-tag :type="getStatusTag(selectedOrder.trang_thai)">{{
              getStatusText(selectedOrder.trang_thai)
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Địa chỉ" :span="2">{{
            selectedOrder.dia_chi_giao_hang
          }}</el-descriptions-item>
        </el-descriptions>

        <h4 style="margin-top: 20px">Danh sách sản phẩm</h4>
        <el-table :data="selectedOrder.chi_tiet" border style="width: 100%">
          <el-table-column label="Ảnh" width="70">
            <template #default="scope">
              <img
                :src="`http://localhost:3000/${scope.row.hinh_anh_dai_dien}`"
                style="width: 50px; height: 50px; object-fit: cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="ten_san_pham" label="Sản phẩm" />
          <el-table-column prop="ten_mau_ma" label="Mẫu mã" width="120" />
          <el-table-column label="Đơn giá" width="120">
            <template #default="scope">{{ formatCurrency(scope.row.don_gia) }}</template>
          </el-table-column>
          <el-table-column prop="so_luong" label="SL" width="60" align="center" />
          <el-table-column label="Thành tiền" width="120">
            <template #default="scope">{{
              formatCurrency(scope.row.don_gia * scope.row.so_luong)
            }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
