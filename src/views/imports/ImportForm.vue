<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PhieuNhapService from '@/services/phieu-nhap.service'
import SanPhamService from '@/services/san-pham.service' // Để lấy danh sách sản phẩm
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'

const router = useRouter()
const products = ref([]) // Danh sách sản phẩm (chỉ cần id, tên)
const form = reactive({
  ghi_chu: '',
  chi_tiet: [
    // Mặc định có 1 dòng trống
    { ma_mau_ma: null, so_luong_nhap: 1, gia_nhap: 0, product_id_temp: null },
  ],
})

// Lấy danh sách tất cả sản phẩm để điền vào dropdown
const fetchProducts = async () => {
  try {
    const res = await SanPhamService.getAll()
    products.value = res
  } catch (error) {
    console.error(error)
  }
}

// Khi chọn sản phẩm, cần lấy danh sách mẫu mã của sản phẩm đó
// (Để đơn giản, ở đây ta giả sử API getAll đã trả về đủ thông tin, hoặc ta phải gọi API chi tiết.
// Cách tốt nhất cho thực tế: Dropdown chọn sản phẩm -> Gọi API lấy mẫu mã -> Dropdown chọn mẫu mã.
// NHƯNG ĐỂ NHANH GỌN CHO TIỂU LUẬN: Ta sẽ làm dropdown chọn sản phẩm, sau đó tự động chọn mẫu mã đầu tiên hoặc hiển thị dropdown mẫu mã nếu có thời gian)

// --- PHƯƠNG ÁN ĐƠN GIẢN CHO TIỂU LUẬN ---
// Ta sẽ load TẤT CẢ sản phẩm, và khi chọn sản phẩm, ta sẽ gọi API lấy chi tiết để lấy danh sách mẫu mã của nó.

const productVariantsMap = reactive({}) // Cache danh sách mẫu mã của các sản phẩm đã chọn

const handleProductChange = async (row) => {
  if (!row.product_id_temp) return

  // Gọi API lấy chi tiết sản phẩm để lấy mẫu mã
  try {
    const detail = await SanPhamService.get(row.product_id_temp)
    productVariantsMap[row.product_id_temp] = detail.mau_ma
    // Mặc định chọn mẫu mã đầu tiên
    if (detail.mau_ma.length > 0) {
      row.ma_mau_ma = detail.mau_ma[0].id
    }
  } catch (error) {
    console.error(error)
  }
}

const addRow = () => {
  form.chi_tiet.push({ ma_mau_ma: null, so_luong_nhap: 1, gia_nhap: 0, product_id_temp: null })
}

const removeRow = (index) => {
  form.chi_tiet.splice(index, 1)
}

const submitForm = async () => {
  // Validate cơ bản
  if (form.chi_tiet.some((item) => !item.ma_mau_ma || item.so_luong_nhap <= 0)) {
    ElMessage.error('Vui lòng kiểm tra lại thông tin nhập hàng')
    return
  }

  try {
    // Loại bỏ trường tạm product_id_temp trước khi gửi
    const payload = {
      ghi_chu: form.ghi_chu,
      chi_tiet: form.chi_tiet.map(({ product_id_temp, ...rest }) => rest),
    }
    await PhieuNhapService.create(payload)
    ElMessage.success('Nhập hàng thành công')
    router.push('/imports')
  } catch (error) {
    ElMessage.error('Lỗi khi tạo phiếu nhập')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div style="background: #fff; padding: 20px; border-radius: 8px">
    <h2>Tạo Phiếu Nhập Kho</h2>

    <el-form label-width="100px" style="max-width: 800px">
      <el-form-item label="Ghi chú">
        <el-input v-model="form.ghi_chu" type="textarea" />
      </el-form-item>

      <h4>Chi tiết nhập hàng</h4>
      <el-table :data="form.chi_tiet" border style="width: 100%; margin-bottom: 20px">
        <el-table-column label="Sản phẩm" width="250">
          <template #default="scope">
            <el-select
              v-model="scope.row.product_id_temp"
              placeholder="Chọn sản phẩm"
              filterable
              @change="handleProductChange(scope.row)"
            >
              <el-option v-for="p in products" :key="p.id" :label="p.ten_san_pham" :value="p.id" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="Mẫu mã" width="200">
          <template #default="scope">
            <el-select
              v-model="scope.row.ma_mau_ma"
              placeholder="Chọn mẫu"
              :disabled="!scope.row.product_id_temp"
            >
              <el-option
                v-for="v in productVariantsMap[scope.row.product_id_temp] || []"
                :key="v.id"
                :label="v.ten_mau_ma"
                :value="v.id"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="Số lượng" width="150">
          <template #default="scope">
            <el-input-number v-model="scope.row.so_luong_nhap" :min="1" style="width: 100%" />
          </template>
        </el-table-column>

        <el-table-column label="Giá nhập" width="150">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.gia_nhap"
              :min="0"
              :step="1000"
              style="width: 100%"
            />
          </template>
        </el-table-column>

        <el-table-column width="60" align="center">
          <template #default="scope">
            <el-button
              type="danger"
              :icon="Delete"
              circle
              size="small"
              @click="removeRow(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" plain @click="addRow" style="width: 100%; margin-bottom: 20px">
        <el-icon><Plus /></el-icon> Thêm dòng sản phẩm
      </el-button>

      <div style="text-align: right">
        <el-button @click="router.push('/imports')">Hủy</el-button>
        <el-button type="success" @click="submitForm">Hoàn tất Nhập kho</el-button>
      </div>
    </el-form>
  </div>
</template>
