<template>
  <div class="filter-bar">
    <div class="filter-left">
      <el-radio-group :model-value="statusFilter" @update:model-value="$emit('update:statusFilter', $event)">
        <el-radio-button label="ALL">{{ $t('orders.filterAll', { count: totalOrders }) }}</el-radio-button>
        <el-radio-button label="PENDING_PAYMENT">
          {{ $t('orders.filterPending') }}
          <el-badge :value="pendingCount" :hidden="pendingCount === 0" class="badge-dot" />
        </el-radio-button>
        <el-radio-button label="COOKING">
          {{ $t('orders.filterCooking') }}
          <el-badge :value="cookingCount" :hidden="cookingCount === 0" type="primary" class="badge-dot" />
        </el-radio-button>
        <el-radio-button label="COMPLETED">{{ $t('orders.filterCompleted') }}</el-radio-button>
        <el-radio-button label="CANCELLED">{{ $t('orders.filterCancelled') }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="filter-right">
      <el-select
        :model-value="diningTypeFilter"
        @update:model-value="$emit('update:diningTypeFilter', $event)"
        style="width: 130px"
      >
        <el-option :label="$t('orders.diningAll')" value="ALL" />
        <el-option :label="$t('orders.diningDineIn')" value="DINE_IN" />
        <el-option :label="$t('orders.diningTakeout')" value="TAKEOUT" />
      </el-select>
      <el-input
        :model-value="searchQuery"
        @update:model-value="$emit('update:searchQuery', $event)"
        :placeholder="$t('orders.searchPlaceholder')"
        style="width: 220px"
        clearable
      />
      <el-button type="primary" plain @click="$emit('refresh')" :loading="loading">
        <el-icon><Refresh /></el-icon> {{ $t('common.refresh') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue';

defineProps<{
  statusFilter: string;
  diningTypeFilter: string;
  searchQuery: string;
  pendingCount: number;
  cookingCount: number;
  totalOrders: number;
  loading: boolean;
}>();

defineEmits<{
  (e: 'update:statusFilter', val: string): void;
  (e: 'update:diningTypeFilter', val: string): void;
  (e: 'update:searchQuery', val: string): void;
  (e: 'refresh'): void;
}>();
</script>

<style scoped>
.filter-bar {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.filter-right { display: flex; gap: 12px; align-items: center; }
.badge-dot { margin-left: 6px; }
</style>
