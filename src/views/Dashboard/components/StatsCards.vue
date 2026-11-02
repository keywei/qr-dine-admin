<template>
  <div class="stats-cards-grid">
    <el-card shadow="never" class="stat-card">
      <div class="stat-inner">
        <div class="stat-icon-wrapper icon-revenue"><span>💰</span></div>
        <div class="stat-content">
          <span class="stat-label">{{ $t('dashboard.todayRevenue') }}</span>
          <div class="stat-value">NT$ {{ stats.todayRevenue?.toLocaleString() || 0 }}</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="stat-card">
      <div class="stat-inner">
        <div class="stat-icon-wrapper icon-orders"><span>🧾</span></div>
        <div class="stat-content">
          <span class="stat-label">{{ $t('dashboard.todayOrders') }}</span>
          <div class="stat-value">{{ stats.todayOrderCount || 0 }} <span class="unit">{{ $t('dashboard.unitCount') }}</span></div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="stat-card">
      <div class="stat-inner">
        <div class="stat-icon-wrapper icon-cooking"><span>👨‍🍳</span></div>
        <div class="stat-content">
          <span class="stat-label">{{ $t('dashboard.cookingOrders') }}</span>
          <div class="stat-value text-blue">{{ stats.cookingCount || 0 }} <span class="unit">{{ $t('dashboard.unitCount') }}</span></div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="stat-card">
      <div class="stat-inner">
        <div class="stat-icon-wrapper icon-pending"><span>⏳</span></div>
        <div class="stat-content">
          <span class="stat-label">{{ $t('dashboard.pendingOrders') }}</span>
          <div class="stat-value text-amber">{{ stats.pendingPaymentCount || 0 }} <span class="unit">{{ $t('dashboard.unitCount') }}</span></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { DashboardStats } from '../../../types/dashboard';

defineProps<{ stats: DashboardStats }>();
</script>

<style scoped>
.stats-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.stat-card { border-radius: 12px; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.stat-inner { display: flex; align-items: center; gap: 16px; }
.stat-icon-wrapper { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 26px; }
.icon-revenue { background-color: #fef3c7; }
.icon-orders { background-color: #e0f2fe; }
.icon-cooking { background-color: #dbeafe; }
.icon-pending { background-color: #fef2f2; }
.stat-content { display: flex; flex-direction: column; }
.stat-label { font-size: 13px; color: #64748b; font-weight: 500; }
.stat-value { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 4px; }
.unit { font-size: 13px; font-weight: normal; color: #94a3b8; }
.text-blue { color: #2563eb; }
.text-amber { color: #d97706; }
</style>
