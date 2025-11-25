<script setup>
import { ref, onMounted } from 'vue'
import KhachHangService from '@/services/khach-hang.service'
import { ElMessage, ElMessageBox } from 'element-plus'

const customers = ref([])

const fetchCustomers = async () => {
  try {
    customers.value = await KhachHangService.getAll()
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = (id) => {
  ElMessageBox.confirm(
    'Bạn có chắc chắn muốn xóa khách hàng này? Hành động này sẽ xóa cả lịch sử mua hàng của họ.',
    'Cảnh báo',
    { confirmButtonText: 'Xóa', cancelButtonText: 'Hủy', type: 'warning' },
  ).then(async () => {
    try {
      await KhachHangService.delete(id)
      ElMessage.success('Đã xóa thành công')
      fetchCustomers()
    } catch (error) {
      ElMessage.error('Lỗi khi xóa khách hàng')
    }
  })
}

onMounted(() => {
  fetchCustomers()
})
</script>

<template>
  <div>
    <h2>Quản lý Khách hàng</h2>
    <el-table :data="customers" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="ho_ten" label="Họ tên" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="so_dien_thoai" label="SĐT" />
      <el-table-column label="Hành động" width="120" align="center">
        <template #default="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">Xóa</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
