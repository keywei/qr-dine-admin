<template>
  <el-card shadow="never" class="!rounded-xl !border-none">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-base font-bold text-slate-800">{{ $t('dashboard.top5Title') }}</span>
        <el-button type="primary" link @click="$emit('refresh')">{{ $t('dashboard.recalculate') }}</el-button>
      </div>
    </template>

    <div v-if="dishes.length > 0" class="flex flex-col gap-3.5">
      <div v-for="(dish, idx) in dishes" :key="idx" class="flex items-center gap-3.5">
        <div class="w-7 h-7 rounded-md flex items-center justify-center font-extrabold text-sm" :class="idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-slate-400 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'">
          {{ idx + 1 }}
        </div>
        <div class="flex-1 flex flex-col gap-1">
          <span class="text-sm font-semibold text-slate-800">{{ dish.name }}</span>
          <el-progress
            :percentage="calcPercentage(dish.totalQuantity)"
            :stroke-width="8"
            :show-text="false"
            :color="colors[idx % colors.length]"
          />
        </div>
        <div class="flex items-baseline gap-0.5">
          <span class="text-lg font-extrabold text-sky-600">{{ dish.totalQuantity }}</span>
          <span class="text-xs text-slate-500">{{ $t('common.unitPortion') }}</span>
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
