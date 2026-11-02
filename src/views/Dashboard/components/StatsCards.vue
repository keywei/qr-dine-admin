<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <el-card shadow="never" class="!rounded-xl !border-none !shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl bg-amber-100"><span>💰</span></div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500 font-medium">{{ $t('dashboard.todayRevenue') }}</span>
          <div class="text-2xl font-extrabold text-slate-900 mt-1">NT$ {{ stats.todayRevenue?.toLocaleString() || 0 }}</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="!rounded-xl !border-none !shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl bg-sky-100"><span>🧾</span></div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500 font-medium">{{ $t('dashboard.todayOrders') }}</span>
          <div class="text-2xl font-extrabold text-slate-900 mt-1">{{ stats.todayOrderCount || 0 }} <span class="text-xs font-normal text-slate-400">{{ $t('dashboard.unitCount') }}</span></div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="!rounded-xl !border-none !shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl bg-blue-100"><span>👨‍🍳</span></div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500 font-medium">{{ $t('dashboard.cookingOrders') }}</span>
          <div class="text-2xl font-extrabold text-blue-600 mt-1">{{ stats.cookingCount || 0 }} <span class="text-xs font-normal text-slate-400">{{ $t('dashboard.unitCount') }}</span></div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="!rounded-xl !border-none !shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl bg-red-50"><span>⏳</span></div>
        <div class="flex flex-col">
          <span class="text-xs text-slate-500 font-medium">{{ $t('dashboard.pendingOrders') }}</span>
          <div class="text-2xl font-extrabold text-amber-600 mt-1">{{ stats.pendingPaymentCount || 0 }} <span class="text-xs font-normal text-slate-400">{{ $t('dashboard.unitCount') }}</span></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { DashboardStats } from '../../../types/dashboard';

defineProps<{ stats: DashboardStats }>();
</script>
