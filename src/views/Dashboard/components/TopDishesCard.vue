<template>
  <el-card shadow="never" class="dash-card">
    <template #header>
      <div class="card-head">
        <span class="head-title">{{ $t('dashboard.top5Title') }}</span>
        <el-button type="primary" link @click="$emit('refresh')">{{ $t('dashboard.recalculate') }}</el-button>
      </div>
    </template>

    <div v-if="dishes.length > 0" class="top-list">
      <div v-for="(dish, idx) in dishes" :key="idx" class="top-item">
        <div class="rank-badge" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</div>
        <div class="dish-info">
          <span class="dish-name">{{ dish.name }}</span>
          <el-progress
            :percentage="calcPercentage(dish.totalQuantity)"
            :stroke-width="8"
            :show-text="false"
            :color="colors[idx % colors.length]"
          />
        </div>
        <div class="dish-sold">
          <span class="sold-num">{{ dish.totalQuantity }}</span>
          <span class="sold-unit">{{ $t('common.unitPortion') }}</span>
        </div>
      </div>
    </div>
    <el-empty v-else :description="$t('dashboard.noSales')" />
  </el-card>
</template>

<script setup lang="ts">
import type { TopDish } from '../../../types/dashboard';

const props = defineProps<{ dishes: TopDish[] }>();
defineEmits<{ (e: 'refresh'): void }>();

const colors = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#ec4899'];

const calcPercentage = (quantity: number) => {
  const max = props.dishes[0]?.totalQuantity || 1;
  return Math.min(100, Math.round((quantity / max) * 100));
};
</script>

<style scoped>
.dash-card { border-radius: 12px; border: none; }
.card-head { display: flex; justify-content: space-between; align-items: center; }
.head-title { font-size: 16px; font-weight: 700; color: #1e293b; }
.top-list { display: flex; flex-direction: column; gap: 14px; }
.top-item { display: flex; align-items: center; gap: 14px; }
.rank-badge { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; background-color: #e2e8f0; color: #475569; }
.rank-1 { background-color: #f59e0b; color: #fff; }
.rank-2 { background-color: #94a3b8; color: #fff; }
.rank-3 { background-color: #b45309; color: #fff; }
.dish-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.dish-name { font-size: 14px; font-weight: 600; color: #1e293b; }
.dish-sold { display: flex; align-items: baseline; gap: 2px; }
.sold-num { font-size: 18px; font-weight: 800; color: #0284c7; }
.sold-unit { font-size: 12px; color: #64748b; }
</style>
