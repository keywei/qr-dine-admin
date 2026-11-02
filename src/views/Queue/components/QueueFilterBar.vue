<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
    <el-radio-group :model-value="activeTab" @update:model-value="$emit('update:activeTab', $event)" size="default">
      <el-radio-button value="WAITING">{{ $t('queue.tabWaiting') }}</el-radio-button>
      <el-radio-button value="SEATED">{{ $t('queue.tabSeated') }}</el-radio-button>
      <el-radio-button value="CANCELLED">{{ $t('queue.tabCancelled') }}</el-radio-button>
      <el-radio-button value="ALL">{{ $t('queue.tabAll') }}</el-radio-button>
    </el-radio-group>

    <div class="flex items-center gap-2">
      <el-input
        :model-value="searchQuery"
        @update:model-value="$emit('update:searchQuery', $event)"
        :placeholder="$t('queue.searchPlaceholder')"
        clearable
        class="!w-64"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button plain :loading="loading" @click="$emit('refresh')">
        <el-icon><Refresh /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Refresh } from '@element-plus/icons-vue';
import type { QueueFilterTab } from '../../../types/queue';

defineProps<{ activeTab: QueueFilterTab; searchQuery: string; loading: boolean }>();
defineEmits<{
  (e: 'update:activeTab', val: QueueFilterTab): void;
  (e: 'update:searchQuery', val: string): void;
  (e: 'refresh'): void;
}>();
</script>
