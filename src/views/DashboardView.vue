<script setup>
import { ref, onMounted, watch } from 'vue'
import ThongKeService from '@/services/thong-ke.service'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { ElMessage } from 'element-plus'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const overview = ref({
  so_luong_khach_hang: 0,
  so_luong_san_pham: 0,
  so_luong_don_hang: 0,
  tong_doanh_thu: 0,
})

const chartData = ref({ labels: [], datasets: [] })
const chartOptions = { responsive: true, maintainAspectRatio: false }

// --- NÂNG CẤP: Biến lưu khoảng thời gian ---
const dateRange = ref([]) // Mảng chứa [startDate, endDate]

// Hàm format ngày YYYY-MM-DD để gửi lên API
const formatDateStr = (date) => date.toISOString().split('T')[0]

// Hàm lấy dữ liệu tổng quan (chỉ cần gọi 1 lần)
const fetchOverview = async () => {
  try {
    overview.value = await ThongKeService.getOverview()
  } catch (error) {
    console.error(error)
  }
}

// Hàm lấy dữ liệu biểu đồ (gọi lại khi đổi ngày)
const fetchChartData = async () => {
  if (!dateRange.value || dateRange.value.length < 2) return

  try {
    const [start, end] = dateRange.value
    const revenueData = await ThongKeService.getDailyRevenue(
      formatDateStr(start),
      formatDateStr(end),
    )

    chartData.value = {
      labels: revenueData.map((item) => item.ngay),
      datasets: [
        {
          label: 'Doanh thu (VND)',
          backgroundColor: '#409EFF',
          borderColor: '#409EFF',
          data: revenueData.map((item) => item.doanh_thu),
          tension: 0.3, // Làm mềm đường biểu đồ
        },
      ],
    }
  } catch (error) {
    ElMessage.error('Lỗi tải biểu đồ')
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// Khởi tạo
onMounted(() => {
  fetchOverview()

  // Mặc định chọn 30 ngày gần nhất
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  dateRange.value = [start, end]

  fetchChartData()
})

// Tự động tải lại biểu đồ khi chọn ngày mới
watch(dateRange, () => {
  fetchChartData()
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Tổng quan</h2>
      <!-- --- NÂNG CẤP: Date Picker --- -->
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="đến"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
        :shortcuts="[
          {
            text: '7 ngày qua',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            },
          },
          {
            text: '30 ngày qua',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            },
          },
          {
            text: '3 tháng qua',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            },
          },
        ]"
      />
    </div>

    <el-row :gutter="20" class="mb-4">
      <!-- ... (Các thẻ thống kê giữ nguyên) ... -->
      <el-col :span="6"
        ><el-card shadow="hover" class="card-stat"
          ><div class="stat-title">Doanh số</div>
          <div class="stat-value text-success">
            {{ formatCurrency(overview.tong_doanh_thu) }}
          </div></el-card
        ></el-col
      >
      <el-col :span="6"
        ><el-card shadow="hover" class="card-stat"
          ><div class="stat-title">Đơn hàng</div>
          <div class="stat-value text-primary">{{ overview.so_luong_don_hang }}</div></el-card
        ></el-col
      >
      <el-col :span="6"
        ><el-card shadow="hover" class="card-stat"
          ><div class="stat-title">Sản phẩm</div>
          <div class="stat-value text-warning">{{ overview.so_luong_san_pham }}</div></el-card
        ></el-col
      >
      <el-col :span="6"
        ><el-card shadow="hover" class="card-stat"
          ><div class="stat-title">Khách hàng</div>
          <div class="stat-value text-info">{{ overview.so_luong_khach_hang }}</div></el-card
        ></el-col
      >
    </el-row>

    <el-card shadow="never">
      <h3>Biểu đồ doanh thu</h3>
      <div style="height: 400px">
        <Line
          v-if="
            chartData.datasets &&
            chartData.datasets.length > 0 &&
            chartData.datasets[0].data.length > 0
          "
          :data="chartData"
          :options="chartOptions"
        />
        <div v-else class="text-center text-muted" style="padding-top: 150px">
          Không có dữ liệu doanh thu trong khoảng thời gian này.
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
.mb-4 {
  margin-bottom: 20px;
}
.card-stat {
  text-align: center;
}
.stat-title {
  font-size: 16px;
  color: #909399;
  margin-bottom: 10px;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
}
.text-success {
  color: #67c23a;
}
.text-primary {
  color: #409eff;
}
.text-warning {
  color: #e6a23c;
}
.text-info {
  color: #909399;
}
</style>
