<template>
  <div class="dashboard-page" v-loading="loading">
    <!-- Stat Cards -->
    <div class="stats-cards-grid">
      <el-card shadow="never" class="stat-card">
        <div class="stat-inner">
          <div class="stat-icon-wrapper icon-revenue">
            <span>💰</span>
          </div>
          <div class="stat-content">
            <span class="stat-label">今日營業額</span>
            <div class="stat-value">NT$ {{ stats.todayRevenue?.toLocaleString() || 0 }}</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="stat-card">
        <div class="stat-inner">
          <div class="stat-icon-wrapper icon-orders">
            <span>🧾</span>
          </div>
          <div class="stat-content">
            <span class="stat-label">今日成交訂單數</span>
            <div class="stat-value">{{ stats.todayOrderCount || 0 }} <span class="unit">筆</span></div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="stat-card">
        <div class="stat-inner">
          <div class="stat-icon-wrapper icon-cooking">
            <span>👨‍🍳</span>
          </div>
          <div class="stat-content">
            <span class="stat-label">當前製作中訂單</span>
            <div class="stat-value text-blue">{{ stats.cookingCount || 0 }} <span class="unit">筆</span></div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="stat-card">
        <div class="stat-inner">
          <div class="stat-icon-wrapper icon-pending">
            <span>⏳</span>
          </div>
          <div class="stat-content">
            <span class="stat-label">待現場收款訂單</span>
            <div class="stat-value text-amber">{{ stats.pendingPaymentCount || 0 }} <span class="unit">筆</span></div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Charts / Top Dishes Grid -->
    <div class="dashboard-grid">
      <!-- Top Selling Dishes -->
      <el-card shadow="never" class="dash-card">
        <template #header>
          <div class="card-head">
            <span class="head-title">🔥 暢銷餐點排行榜 Top 5</span>
            <el-button type="primary" link @click="fetchStats">重新計算</el-button>
          </div>
        </template>

        <div v-if="stats.topDishes && stats.topDishes.length > 0" class="top-list">
          <div v-for="(dish, idx) in stats.topDishes" :key="idx" class="top-item">
            <div class="rank-badge" :class="'rank-' + (Number(idx) + 1)">{{ Number(idx) + 1 }}</div>
            <div class="dish-info">
              <span class="dish-name">{{ dish.name }}</span>
              <el-progress
                :percentage="calcPercentage(Number(dish.totalQuantity))"
                :stroke-width="8"
                :show-text="false"
                :color="getProgressColor(Number(idx))"
              />
            </div>
            <div class="dish-sold">
              <span class="sold-num">{{ dish.totalQuantity }}</span>
              <span class="sold-unit">份</span>
            </div>
          </div>
        </div>
        <el-empty v-else description="尚無銷售紀錄" />
      </el-card>

      <!-- Store Status / Tips -->
      <el-card shadow="never" class="dash-card">
        <template #header>
          <div class="card-head">
            <span class="head-title">💡 門市營運小提醒</span>
          </div>
        </template>

        <div class="tips-content">
          <div class="tip-row">
            <span class="tip-icon">✅</span>
            <div class="tip-desc">
              <b>即時出餐推播已啟動：</b>
              當後台確認收款或出餐時，顧客手機畫面將於秒級自動變更進度。
            </div>
          </div>

          <div class="tip-row">
            <span class="tip-icon">📱</span>
            <div class="tip-desc">
              <b>外帶條碼與內用條碼獨立：</b>
              門市外帶條碼可張貼於店門口或騎樓，避免外帶顧客佔用內用桌號。
            </div>
          </div>

          <div class="tip-row">
            <span class="tip-icon">🔊</span>
            <div class="tip-desc">
              <b>新單鈴聲提示：</b>
              請確保左側選單的「新單音效」已開啟，以便在忙碌時不漏單。
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const stats = ref<any>({
  todayRevenue: 0,
  todayOrderCount: 0,
  cookingCount: 0,
  pendingPaymentCount: 0,
  completedTodayCount: 0,
  topDishes: [],
});

const loading = ref(false);

const fetchStats = async () => {
  loading.value = true;
  try {
    const res: any = await api.get('/stats/summary');
    if (res.success && res.data) {
      stats.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const calcPercentage = (quantity: number) => {
  const max = stats.value.topDishes?.[0]?.totalQuantity || 1;
  return Math.min(100, Math.round((quantity / max) * 100));
};

const getProgressColor = (idx: number) => {
  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#ec4899'];
  return colors[idx % colors.length];
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.icon-revenue {
  background-color: #fef3c7;
}

.icon-orders {
  background-color: #e0f2fe;
}

.icon-cooking {
  background-color: #dbeafe;
}

.icon-pending {
  background-color: #fef2f2;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-top: 4px;
}

.unit {
  font-size: 13px;
  font-weight: normal;
  color: #94a3b8;
}

.text-blue {
  color: #2563eb;
}

.text-amber {
  color: #d97706;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.dash-card {
  border-radius: 12px;
  border: none;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.top-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.rank-badge {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  background-color: #e2e8f0;
  color: #475569;
}

.rank-1 {
  background-color: #f59e0b;
  color: #ffffff;
}

.rank-2 {
  background-color: #94a3b8;
  color: #ffffff;
}

.rank-3 {
  background-color: #b45309;
  color: #ffffff;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dish-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.dish-sold {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.sold-num {
  font-size: 18px;
  font-weight: 800;
  color: #0284c7;
}

.sold-unit {
  font-size: 12px;
  color: #64748b;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8fafc;
}

.tip-icon {
  font-size: 20px;
}

.tip-desc {
  font-size: 14px;
  color: #334155;
  line-height: 1.5;
}
</style>
