<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')
const users = ref({})
const selectedUserId = ref(null)
const adminMessage = ref('')
// Lưu lịch sử chat tạm thời trên Admin: { 'socketId': [ { sender: 'user/admin', text: '...' } ] }
const chatHistory = ref({})

const selectUser = (userId) => {
  selectedUserId.value = userId
  // Đánh dấu đã xem (logic frontend)
  if (users.value[userId]) users.value[userId].hasNew = false
}

const sendReply = () => {
  if (!adminMessage.value.trim() || !selectedUserId.value) return

  // Gửi sự kiện lên server
  socket.emit('admin-reply', {
    targetUserId: selectedUserId.value,
    text: adminMessage.value,
  })

  // Lưu vào lịch sử local để hiện lên màn hình
  if (!chatHistory.value[selectedUserId.value]) chatHistory.value[selectedUserId.value] = []
  chatHistory.value[selectedUserId.value].push({ sender: 'admin', text: adminMessage.value })

  adminMessage.value = ''
}

onMounted(() => {
  socket.emit('admin-join')

  socket.on('update-user-list', (list) => {
    users.value = list
  })

  socket.on('message-from-user', (data) => {
    const { userId, text } = data

    // Lưu tin nhắn
    if (!chatHistory.value[userId]) chatHistory.value[userId] = []
    chatHistory.value[userId].push({ sender: 'user', text: text })

    // Thông báo có tin mới (nếu đang không chat với user này)
    if (users.value[userId] && selectedUserId.value !== userId) {
      users.value[userId].hasNew = true
    }
  })
})

onUnmounted(() => {
  socket.disconnect()
})
</script>

<template>
  <div class="chat-dashboard">
    <!-- Danh sách User (Bên trái) -->
    <div class="user-list">
      <h3>Khách đang Online</h3>
      <div
        v-for="(user, id) in users"
        :key="id"
        class="user-item"
        :class="{ active: selectedUserId === id, new: user.hasNew }"
        @click="selectUser(id)"
      >
        {{ user.name }}
        <span v-if="user.hasNew" class="badge">!</span>
      </div>
    </div>

    <!-- Khung Chat (Bên phải) -->
    <div class="chat-area">
      <div v-if="selectedUserId" class="chat-window">
        <div class="messages">
          <div
            v-for="(msg, i) in chatHistory[selectedUserId]"
            :key="i"
            :class="['msg', msg.sender === 'admin' ? 'msg-admin' : 'msg-user']"
          >
            {{ msg.text }}
          </div>
        </div>
        <div class="input-area">
          <el-input
            v-model="adminMessage"
            placeholder="Nhập câu trả lời..."
            @keyup.enter="sendReply"
          />
          <el-button type="primary" @click="sendReply">Gửi</el-button>
        </div>
      </div>
      <div v-else class="empty-state">Chọn một khách hàng để bắt đầu chat</div>
    </div>
  </div>
</template>

<style scoped>
.chat-dashboard {
  display: flex;
  height: 80vh;
  border: 1px solid #ddd;
}
.user-list {
  width: 250px;
  border-right: 1px solid #ddd;
  padding: 10px;
  overflow-y: auto;
}
.user-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}
.user-item:hover {
  background: #f5f5f5;
}
.user-item.active {
  background: #e6f7ff;
  font-weight: bold;
}
.user-item.new {
  color: red;
}
.badge {
  background: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  font-size: 12px;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.msg {
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 70%;
}
.msg-user {
  align-self: flex-start;
  background: #fff;
  border: 1px solid #ddd;
}
.msg-admin {
  align-self: flex-end;
  background: #409eff;
  color: white;
}
.input-area {
  padding: 10px;
  display: flex;
  gap: 10px;
  background: white;
  border-top: 1px solid #ddd;
}
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
</style>
