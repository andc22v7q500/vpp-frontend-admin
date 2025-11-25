<script setup>
import { ref, onMounted, reactive } from 'vue'
import NhanVienService from '@/services/nhan-vien.service'
import { ElMessage, ElMessageBox } from 'element-plus'

const staffs = ref([])
const dialogVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  ho_ten: '',
  email: '',
  mat_khau: '', // Chỉ dùng khi tạo mới
})

const rules = {
  ho_ten: [{ required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' }],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' },
  ],
  mat_khau: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }],
}

const fetchStaffs = async () => {
  try {
    staffs.value = await NhanVienService.getAll()
  } catch (error) {
    console.error(error)
  }
}

const openAddDialog = () => {
  isEditMode.value = false
  form.id = null
  form.ho_ten = ''
  form.email = ''
  form.mat_khau = ''
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  isEditMode.value = true
  form.id = row.id
  form.ho_ten = row.ho_ten
  form.email = row.email // Email thường không cho sửa, chỉ hiển thị
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEditMode.value) {
          await NhanVienService.update(form.id, { ho_ten: form.ho_ten })
          ElMessage.success('Cập nhật thành công')
        } else {
          await NhanVienService.create(form)
          ElMessage.success('Tạo nhân viên mới thành công')
        }
        dialogVisible.value = false
        fetchStaffs()
      } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Lỗi (Có thể do không phải Super Admin)')
      }
    }
  })
}

const handleDelete = (id) => {
  if (id === 1) {
    ElMessage.warning('Không thể xóa Super Admin')
    return
  }
  ElMessageBox.confirm('Bạn có chắc chắn muốn xóa nhân viên này?', 'Cảnh báo', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning',
  }).then(async () => {
    try {
      await NhanVienService.delete(id)
      ElMessage.success('Đã xóa thành công')
      fetchStaffs()
    } catch (error) {
      ElMessage.error('Lỗi (Có thể do không phải Super Admin)')
    }
  })
}

onMounted(() => {
  fetchStaffs()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
      <h2>Quản lý Nhân viên</h2>
      <el-button type="primary" @click="openAddDialog">Thêm Nhân viên</el-button>
    </div>

    <el-table :data="staffs" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="ho_ten" label="Họ tên" />
      <el-table-column prop="email" label="Email" />
      <el-table-column label="Hành động" width="180" align="center">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">Sửa</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.id)"
            :disabled="scope.row.id === 1"
            >Xóa</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? 'Cập nhật Nhân viên' : 'Thêm Nhân viên mới'"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="Họ tên" prop="ho_ten">
          <el-input v-model="form.ho_ten" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" :disabled="isEditMode" />
        </el-form-item>
        <el-form-item label="Mật khẩu" prop="mat_khau" v-if="!isEditMode">
          <el-input v-model="form.mat_khau" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEditMode ? 'Cập nhật' : 'Tạo mới' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
