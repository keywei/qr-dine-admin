<template>
  <el-container class="layout-container">
    <el-aside width="240px" class="aside-menu">
      <div class="brand">
        <span class="brand-icon">🍜</span>
        <div class="brand-text">
          <span class="title">點餐管理系統</span>
          <span class="subtitle">店家管理控制台</span>
        </div>
      </div>

      <el-menu
        :default-active="activeRoute"
        router
        class="custom-menu"
        background-color="#0f172a"
        text-color="#94a3b8"
        active-text-color="#38bdf8"
      >
        <el-menu-item index="/orders">
          <el-icon><Bell /></el-icon>
          <span>即時接單看板</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <el-icon><Food /></el-icon>
          <span>菜單與分類</span>
        </el-menu-item>
        <el-menu-item index="/tables">
          <el-icon><Grid /></el-icon>
          <span>桌號與 QR 碼</span>
        </el-menu-item>
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>營收銷售統計</span>
        </el-menu-item>
      </el-menu>

      <div class="aside-footer">
        <div class="sound-control">
          <span>新單音效</span>
          <el-switch v-model="soundEnabled" inline-prompt active-text="開" inactive-text="關" />
        </div>
      </div>
    </el-aside>

    <el-container class="main-wrapper">
      <el-header class="top-header">
        <div class="header-left">
          <h3 class="page-title">{{ currentRouteTitle }}</h3>
        </div>
        <div class="header-right">
          <div class="user-badge">
            <el-avatar size="small" style="background-color: #3b82f6">{{ authStore.user?.name?.[0] || '管' }}</el-avatar>
            <span class="user-name">{{ authStore.user?.name || '管理員' }}</span>
          </div>
          <el-button type="danger" link @click="handleLogout">
            <el-icon style="margin-right: 4px"><SwitchButton /></el-icon> 登出
          </el-button>
        </div>
      </el-header>

      <el-main class="content-body">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { Bell, Food, Grid, DataLine, SwitchButton } from '@element-plus/icons-vue';
import { useAuthStore } from '../stores/auth';
import { initAdminSocket } from '../socket';
import { playOrderBell } from '../utils/sound';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const soundEnabled = ref(true);

const activeRoute = computed(() => route.path);

const currentRouteTitle = computed(() => {
  switch (route.path) {
    case '/orders':
      return '即時接單看板';
    case '/menu':
      return '菜單與分類管理';
    case '/tables':
      return '桌號與 QR Code 管理';
    case '/dashboard':
      return '營收與銷售統計';
    default:
      return '管理控制台';
  }
});

const handleLogout = () => {
  authStore.logout();
};

onMounted(() => {
  const socket = initAdminSocket();

  // Listen for new orders
  socket.on('order:new', (order: any) => {
    if (soundEnabled.value) {
      playOrderBell();
    }

    ElNotification({
      title: '🔔 收到新訂單！',
      message: `${order.diningType === 'DINE_IN' ? `桌號 [${order.table?.code || '內用'}]` : '【外帶】'} 新進訂單 #${order.orderNo}，金額 NT$ ${order.totalAmount}`,
      type: 'warning',
      duration: 6000,
      onClick: () => {
        router.push('/orders');
      },
    });
  });
});

onUnmounted(() => {
  const socket = initAdminSocket();
  socket.off('order:new');
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #f8fafc;
}

.aside-menu {
  background-color: #0f172a;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.brand {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid #1e293b;
}

.brand-icon {
  font-size: 28px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-text .title {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

.brand-text .subtitle {
  font-size: 11px;
  color: #64748b;
}

.custom-menu {
  border-right: none;
  flex: 1;
}

.custom-menu .el-menu-item {
  height: 52px;
  font-weight: 500;
  margin: 4px 10px;
  border-radius: 8px;
}

.custom-menu .el-menu-item.is-active {
  background-color: #1e293b !important;
  color: #38bdf8 !important;
  font-weight: 600;
}

.aside-footer {
  padding: 16px 20px;
  border-top: 1px solid #1e293b;
  background-color: #0b1120;
}

.sound-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #94a3b8;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.content-body {
  padding: 20px;
  overflow-y: auto;
  background-color: #f1f5f9;
}
</style>

