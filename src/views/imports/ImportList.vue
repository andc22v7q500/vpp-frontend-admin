<script setup>
import { ref, onMounted } from 'vue'
import PhieuNhapService from '@/services/phieu-nhap.service'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const imports = ref([])
const router = useRouter()

// Biến cho Dialog chi tiết
const dialogVisible = ref(false)
const selectedImport = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const fetchImports = async () => {
  try {
    imports.value = await PhieuNhapService.getAll()
  } catch (error) {
    console.error(error)
  }
}

// Hàm xem chi tiết
const viewDetail = async (id) => {
  try {
    selectedImport.value = await PhieuNhapService.get(id)
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('Lỗi khi tải chi tiết phiếu nhập')
  }
}

onMounted(() => {
  fetchImports()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
      <h2>Lịch sử Nhập hàng</h2>
      <el-button type="primary" @click="router.push('/imports/add')">
        <el-icon><Plus /></el-icon> Tạo phiếu nhập
      </el-button>
    </div>

    <!-- Bảng Danh sách -->
    <el-table :data="imports" border stripe style="width: 100%">
      <el-table-column prop="id" label="Mã phiếu" width="100" align="center" />
      <el-table-column label="Người nhập">
        <template #default="scope">
          {{ scope.row.ten_nhan_vien }} <br />
          <small class="text-muted">ID: {{ scope.row.ma_nhan_vien }}</small>
        </template>
      </el-table-column>
      <el-table-column prop="ngay_nhap" label="Ngày nhập">
        <template #default="scope">{{ formatDate(scope.row.ngay_nhap) }}</template>
      </el-table-column>
      <el-table-column prop="ghi_chu" label="Ghi chú" />
      <el-table-column label="Hành động" width="120" align="center">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row.id)">Chi tiết</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog Chi tiết Phiếu nhập (PHẦN MỚI) -->
    <el-dialog v-model="dialogVisible" title="Chi tiết Phiếu nhập kho" width="800px">
      <div v-if="selectedImport">
        <el-descriptions title="Thông tin chung" :column="2" border>
          <el-descriptions-item label="Mã phiếu">#{{ selectedImport.id }}</el-descriptions-item>
          <el-descriptions-item label="Ngày nhập">{{
            formatDate(selectedImport.ngay_nhap)
          }}</el-descriptions-item>
          <el-descriptions-item label="Người nhập">{{
            selectedImport.ten_nhan_vien
          }}</el-descriptions-item>
          <el-descriptions-item label="Ghi chú">{{ selectedImport.ghi_chu }}</el-descriptions-item>
        </el-descriptions>

        <h4 style="margin-top: 20px">Danh sách hàng nhập</h4>
        <el-table :data="selectedImport.chi_tiet" border style="width: 100%">
          <el-table-column prop="ten_san_pham" label="Sản phẩm" />
          <el-table-column prop="ten_mau_ma" label="Mẫu mã" width="150" />
          <el-table-column prop="gia_nhap" label="Giá nhập" width="150">
            <template #default="scope">{{ formatCurrency(scope.row.gia_nhap) }}</template>
          </el-table-column>
          <el-table-column prop="so_luong_nhap" label="SL Nhập" width="100" align="center" />
          <el-table-column label="Thành tiền" width="150">
            <template #default="scope">
              {{ formatCurrency(scope.row.gia_nhap * scope.row.so_luong_nhap) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
