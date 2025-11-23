<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SanPhamService from '@/services/san-pham.service'
import DanhMucService from '@/services/danh-muc.service'
import ThuongHieuService from '@/services/thuong-hieu.service'
import MauMaService from '@/services/mau-ma.service'
import HinhAnhService from '@/services/hinh-anh.service'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Edit } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isEditMode = ref(false)
const productId = route.params.id

// Dữ liệu dropdown
const categories = ref([])
const brands = ref([])

// Dữ liệu sản phẩm chính
const form = reactive({
  ten_san_pham: '',
  mo_ta: '',
  ma_danh_muc: null,
  ma_thuong_hieu: null,
})

// Dữ liệu mẫu mã & hình ảnh (chỉ dùng khi Edit)
const variants = ref([])
const images = ref([])
const dialogVariantVisible = ref(false)
const editingVariant = reactive({ id: null, ten_mau_ma: '', gia_ban: 0, so_luong_ton: 0 })

// --- KHỞI TẠO ---
const initData = async () => {
  try {
    // Lấy danh mục và thương hiệu để điền vào dropdown
    const [catRes, brandRes] = await Promise.all([
      DanhMucService.getAll(),
      ThuongHieuService.getAll(),
    ])
    categories.value = catRes
    brands.value = brandRes

    // Nếu là chế độ Sửa, lấy thông tin sản phẩm
    if (productId) {
      isEditMode.value = true
      await fetchProductDetail()
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchProductDetail = async () => {
  try {
    const product = await SanPhamService.get(productId)
    form.ten_san_pham = product.ten_san_pham
    form.mo_ta = product.mo_ta
    form.ma_danh_muc = product.ma_danh_muc
    form.ma_thuong_hieu = product.ma_thuong_hieu

    variants.value = product.mau_ma || []
    images.value = product.hinh_anh || []
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  initData()
})

// --- XỬ LÝ SẢN PHẨM CHÍNH ---
const submitMainForm = async () => {
  try {
    if (isEditMode.value) {
      await SanPhamService.update(productId, form)
      ElMessage.success('Cập nhật thông tin chung thành công')
    } else {
      const newProduct = await SanPhamService.create(form)
      ElMessage.success('Tạo sản phẩm mới thành công. Vui lòng thêm Mẫu mã và Hình ảnh.')
      // Chuyển hướng sang trang Edit của sản phẩm vừa tạo để thêm mẫu mã/ảnh
      router.push(`/products/edit/${newProduct.id}`)
    }
  } catch (error) {
    ElMessage.error('Lỗi khi lưu sản phẩm')
  }
}

// --- XỬ LÝ MẪU MÃ ---
const newVariant = reactive({ ten_mau_ma: '', gia_ban: 0, so_luong_ton: 0 })

const addVariant = async () => {
  if (!newVariant.ten_mau_ma) return
  try {
    await SanPhamService.createVariant(productId, newVariant)
    ElMessage.success('Thêm mẫu mã thành công')
    newVariant.ten_mau_ma = ''
    newVariant.gia_ban = 0
    newVariant.so_luong_ton = 0
    fetchProductDetail() // Tải lại để cập nhật danh sách
  } catch (error) {
    ElMessage.error('Lỗi khi thêm mẫu mã')
  }
}

const deleteVariant = async (id) => {
  try {
    await MauMaService.delete(id)
    ElMessage.success('Xóa mẫu mã thành công')
    fetchProductDetail()
  } catch (error) {
    ElMessage.error('Lỗi khi xóa mẫu mã')
  }
}

// --- XỬ LÝ HÌNH ẢNH ---
const handleUpload = async (file) => {
  const formData = new FormData()
  formData.append('images', file.raw) // 'images' phải khớp với tên field trong multer ở backend

  try {
    await SanPhamService.uploadImages(productId, formData)
    ElMessage.success('Upload ảnh thành công')
    fetchProductDetail()
  } catch (error) {
    ElMessage.error('Lỗi upload ảnh')
  }
}

const deleteImage = async (id) => {
  try {
    await HinhAnhService.delete(id)
    ElMessage.success('Xóa ảnh thành công')
    fetchProductDetail()
  } catch (error) {
    ElMessage.error('Lỗi khi xóa ảnh')
  }
}
const openEditVariantDialog = (row) => {
  editingVariant.id = row.id
  editingVariant.ten_mau_ma = row.ten_mau_ma
  editingVariant.gia_ban = row.gia_ban
  editingVariant.so_luong_ton = row.so_luong_ton
  dialogVariantVisible.value = true
}

const updateVariant = async () => {
  try {
    await MauMaService.update(editingVariant.id, {
      ten_mau_ma: editingVariant.ten_mau_ma,
      gia_ban: editingVariant.gia_ban,
      so_luong_ton: editingVariant.so_luong_ton,
    })
    ElMessage.success('Cập nhật mẫu mã thành công')
    dialogVariantVisible.value = false
    fetchProductDetail() // Tải lại danh sách
  } catch (error) {
    ElMessage.error('Lỗi khi cập nhật mẫu mã')
  }
}
</script>

<template>
  <div class="product-form-container">
    <div class="header">
      <h2>{{ isEditMode ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới' }}</h2>
      <el-button @click="router.push('/products')">Quay lại</el-button>
    </div>

    <el-form :model="form" label-width="120px" class="main-form">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="Tên sản phẩm">
            <el-input v-model="form.ten_san_pham" />
          </el-form-item>
          <el-form-item label="Mô tả">
            <el-input v-model="form.mo_ta" type="textarea" rows="5" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Danh mục">
            <el-select v-model="form.ma_danh_muc" placeholder="Chọn danh mục" style="width: 100%">
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.ten_danh_muc"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Thương hiệu">
            <el-select
              v-model="form.ma_thuong_hieu"
              placeholder="Chọn thương hiệu"
              style="width: 100%"
            >
              <el-option
                v-for="item in brands"
                :key="item.id"
                :label="item.ten_thuong_hieu"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" class="w-100" @click="submitMainForm">
            {{ isEditMode ? 'Cập nhật Thông tin chung' : 'Tạo Sản phẩm' }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- PHẦN MẪU MÃ & HÌNH ẢNH CHỈ HIỆN KHI ĐANG EDIT -->
    <div v-if="isEditMode" class="mt-4">
      <el-tabs type="border-card">
        <!-- TAB MẪU MÃ -->
        <el-tab-pane label="Mẫu mã / Biến thể">
          <div class="add-variant-box mb-3">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="Tên mẫu">
                <el-input v-model="newVariant.ten_mau_ma" placeholder="Vd: Xanh, Size M" />
              </el-form-item>
              <el-form-item label="Giá bán">
                <el-input-number
                  v-model="newVariant.gia_ban"
                  :min="0"
                  :step="1000"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item label="Tồn kho">
                <el-input-number
                  v-model="newVariant.so_luong_ton"
                  :min="0"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="addVariant">Thêm</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table :data="variants" border style="width: 100%">
            <el-table-column prop="ten_mau_ma" label="Tên Mẫu" />
            <el-table-column prop="gia_ban" label="Giá bán" />
            <el-table-column prop="so_luong_ton" label="Tồn kho" />
            <el-table-column label="Hành động" width="150" align="center">
              <template #default="scope">
                <el-button
                  type="primary"
                  :icon="Edit"
                  circle
                  @click="openEditVariantDialog(scope.row)"
                />
                <!-- Nút Sửa -->
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  @click="deleteVariant(scope.row.id)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- TAB HÌNH ẢNH -->
        <el-tab-pane label="Hình ảnh">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleUpload"
            :show-file-list="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <div class="image-gallery mt-3">
            <div v-for="img in images" :key="img.id" class="image-item">
              <img :src="`http://localhost:3000/${img.url_hinh_anh}`" />
              <div class="actions">
                <el-button type="danger" :icon="Delete" circle @click="deleteImage(img.id)" />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <!-- Dialog Sửa Mẫu mã -->
  <el-dialog v-model="dialogVariantVisible" title="Cập nhật Mẫu mã" width="400px">
    <el-form label-width="100px">
      <el-form-item label="Tên mẫu">
        <el-input v-model="editingVariant.ten_mau_ma" />
      </el-form-item>
      <el-form-item label="Giá bán">
        <el-input-number v-model="editingVariant.gia_ban" :min="0" />
      </el-form-item>
      <el-form-item label="Tồn kho">
        <el-input-number v-model="editingVariant.so_luong_ton" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVariantVisible = false">Hủy</el-button>
        <el-button type="primary" @click="updateVariant">Cập nhật</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.product-form-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.w-100 {
  width: 100%;
}
.mt-4 {
  margin-top: 20px;
}
.mb-3 {
  margin-bottom: 15px;
}

/* Style cho Gallery ảnh */
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.image-item {
  position: relative;
  width: 148px;
  height: 148px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  overflow: hidden;
}
.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-item .actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.image-item:hover .actions {
  opacity: 1;
}
</style>
