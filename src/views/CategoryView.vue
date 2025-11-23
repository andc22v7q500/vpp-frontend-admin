<script setup>
import { ref, onMounted, reactive } from 'vue'
import DanhMucService from '@/services/danh-muc.service'
import { ElMessage, ElMessageBox } from 'element-plus'

const categories = ref([])
const dialogVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref(null)

// Dữ liệu cho form
const form = reactive({
  id: null,
  ten_danh_muc: '',
})

const rules = {
  ten_danh_muc: [{ required: true, message: 'Vui lòng nhập tên danh mục', trigger: 'blur' }],
}

// Lấy danh sách
const fetchCategories = async () => {
  try {
    categories.value = await DanhMucService.getAll()
  } catch (error) {
    console.error(error)
  }
}

// Mở dialog để thêm mới
const openAddDialog = () => {
  isEditMode.value = false
  form.id = null
  form.ten_danh_muc = ''
  dialogVisible.value = true
}

// Mở dialog để sửa
const openEditDialog = (row) => {
  isEditMode.value = true
  form.id = row.id
  form.ten_danh_muc = row.ten_danh_muc
  dialogVisible.value = true
}

// Xử lý Submit form
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEditMode.value) {
          await DanhMucService.update(form.id, { ten_danh_muc: form.ten_danh_muc })
          ElMessage.success('Cập nhật thành công')
        } else {
          await DanhMucService.create({ ten_danh_muc: form.ten_danh_muc })
          ElMessage.success('Thêm mới thành công')
        }
        dialogVisible.value = false
        fetchCategories() // Tải lại danh sách
      } catch (error) {
        console.error(error)
        ElMessage.error('Có lỗi xảy ra')
      }
    }
  })
}

// Xử lý Xóa
const handleDelete = (id) => {
  ElMessageBox.confirm(
    'Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.',
    'Cảnh báo',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
    },
  ).then(async () => {
    try {
      await DanhMucService.delete(id)
      ElMessage.success('Đã xóa thành công')
      fetchCategories()
    } catch (error) {
      console.error(error)
      ElMessage.error('Không thể xóa (có thể do danh mục đang chứa sản phẩm)')
    }
  })
}

onMounted(() => {
  fetchCategories()
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
      <h2>Quản lý Danh mục</h2>
      <el-button type="primary" @click="openAddDialog">
        <el-icon style="margin-right: 5px"><Plus /></el-icon> Thêm mới
      </el-button>
    </div>

    <!-- Bảng dữ liệu -->
    <el-table :data="categories" style="width: 100%" border stripe>
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="ten_danh_muc" label="Tên Danh mục" />
      <el-table-column label="Hành động" width="180" align="center">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">Sửa</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">Xóa</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog Thêm/Sửa -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? 'Cập nhật Danh mục' : 'Thêm Danh mục mới'"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="Tên danh mục" prop="ten_danh_muc">
          <el-input v-model="form.ten_danh_muc" />
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
