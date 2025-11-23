<script setup>
import { ref, onMounted } from 'vue'
import SanPhamService from '@/services/san-pham.service'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const products = ref([])
const router = useRouter()

const fetchProducts = async () => {
  try {
    products.value = await SanPhamService.getAll()
  } catch (error) {
    console.error(error)
  }
}

const goToAdd = () => {
  router.push('/products/add')
}

const goToEdit = (id) => {
  router.push(`/products/edit/${id}`)
}

const handleDelete = (id) => {
  ElMessageBox.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?', 'Cảnh báo', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning',
  }).then(async () => {
    try {
      await SanPhamService.delete(id)
      ElMessage.success('Đã xóa thành công')
      fetchProducts()
    } catch (error) {
      console.error(error)
      ElMessage.error('Lỗi khi xóa')
    }
  })
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
      <h2>Quản lý Sản phẩm</h2>
      <el-button type="primary" @click="goToAdd">
        <el-icon><Plus /></el-icon> Thêm sản phẩm
      </el-button>
    </div>

    <el-table :data="products" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="Hình ảnh" width="100">
        <template #default="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="`http://localhost:3000/${scope.row.hinh_anh_dai_dien}`"
            fit="cover"
            v-if="scope.row.hinh_anh_dai_dien"
          />
        </template>
      </el-table-column>
      <el-table-column prop="ten_san_pham" label="Tên sản phẩm" />
      <el-table-column prop="ten_danh_muc" label="Danh mục" width="150" />
      <el-table-column prop="ten_thuong_hieu" label="Thương hiệu" width="150" />
      <el-table-column label="Hành động" width="180">
        <template #default="scope">
          <el-button size="small" @click="goToEdit(scope.row.id)">Sửa</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">Xóa</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
