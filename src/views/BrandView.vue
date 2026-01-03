<script setup>
import { ref, onMounted, reactive } from 'vue'
import ThuongHieuService from '@/services/thuong-hieu.service'
import { ElMessage, ElMessageBox } from 'element-plus'

const brands = ref([])
const dialogVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  ten_thuong_hieu: '',
})

const rules = {
  ten_thuong_hieu: [{ required: true, message: 'Vui lòng nhập tên thương hiệu', trigger: 'blur' }],
}

// Lấy danh sách
const fetchBrands = async () => {
  try {
    const data = await ThuongHieuService.getAll()
    brands.value = data.sort((a, b) => a.id - b.id)
  } catch (error) {
    console.error(error)
  }
}

// Mở dialog thêm
const openAddDialog = () => {
  isEditMode.value = false
  form.id = null
  form.ten_thuong_hieu = ''
  dialogVisible.value = true
}

// Mở dialog sửa
const openEditDialog = (row) => {
  isEditMode.value = true
  form.id = row.id
  form.ten_thuong_hieu = row.ten_thuong_hieu
  dialogVisible.value = true
}

// Submit
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEditMode.value) {
          await ThuongHieuService.update(form.id, { ten_thuong_hieu: form.ten_thuong_hieu })
          ElMessage.success('Cập nhật thành công')
        } else {
          await ThuongHieuService.create({ ten_thuong_hieu: form.ten_thuong_hieu })
          ElMessage.success('Thêm mới thành công')
        }
        dialogVisible.value = false
        fetchBrands()
      } catch (error) {
        console.error(error)
        ElMessage.error('Có lỗi xảy ra')
      }
    }
  })
}

// Xóa
const handleDelete = (id) => {
  ElMessageBox.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?', 'Cảnh báo', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning',
  }).then(async () => {
    try {
      await ThuongHieuService.delete(id)
      ElMessage.success('Đã xóa thành công')
      fetchBrands()
    } catch (error) {
      console.error(error)
      ElMessage.error('Không thể xóa (có thể do thương hiệu đang được sử dụng)')
    }
  })
}

onMounted(() => {
  fetchBrands()
})
</script>

<template>
  <div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      "
    >
      <h2>Quản lý Thương hiệu</h2>
      <el-button type="primary" @click="openAddDialog">
        <el-icon style="margin-right: 5px"><Plus /></el-icon> Thêm mới
      </el-button>
    </div>

    <el-table :data="brands" style="width: 100%" border stripe>
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="ten_thuong_hieu" label="Tên Thương hiệu" />
      <el-table-column label="Hành động" width="180" align="center">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">Sửa</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">Xóa</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? 'Cập nhật Thương hiệu' : 'Thêm Thương hiệu mới'"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
        <el-form-item label="Tên thương hiệu" prop="ten_thuong_hieu">
          <el-input v-model="form.ten_thuong_hieu" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
