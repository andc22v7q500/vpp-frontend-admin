<script setup>
import { ref, onMounted } from 'vue'
import PhieuNhapService from '@/services/phieu-nhap.service'
import { useRouter } from 'vue-router'

const imports = ref([])
const router = useRouter()

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const fetchImports = async () => {
  try {
    imports.value = await PhieuNhapService.getAll()
  } catch (error) {
    console.error(error)
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
          <!-- Có thể làm trang xem chi tiết sau -->
          <el-button size="small" @click="">Chi tiết</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
