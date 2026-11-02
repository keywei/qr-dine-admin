<template>
  <div class="bg-white px-5 py-4 rounded-xl flex justify-between items-center shadow-sm">
    <el-radio-group
      :model-value="statusFilter"
      @update:model-value="$emit('update:statusFilter', $event)"
      size="large"
    >
      <el-radio-button value="ALL">
        {{ $t('orders.filterAll', { count: totalOrders }) }}
      </el-radio-button>
      <el-radio-button value="PENDING_PAYMENT">
        {{ $t('orders.filterPending') }}
        <el-badge v-if="pendingCount > 0" :value="pendingCount" class="ml-1.5" type="danger" />
      </el-radio-button>
      <el-radio-button value="COOKING">
        {{ $t('orders.filterCooking') }}
        <el-badge v-if="cookingCount > 0" :value="cookingCount" class="ml-1.5" type="primary" />
      </el-radio-button>
      <el-radio-button value="COMPLETED">
        {{ $t('orders.filterCompleted') }}
      </el-radio-button>
      <el-radio-button value="CANCELLED">
        {{ $t('orders.filterCancelled') }}
      </el-radio-button>
    </el-radio-group>

    <div class="flex gap-3 items-center">
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
        prefix-icon="Search"
        clearable
        style="width: 200px"
      />

      <el-button :loading="loading" @click="$emit('refresh')">
        <el-icon><Refresh /></el-icon>
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
