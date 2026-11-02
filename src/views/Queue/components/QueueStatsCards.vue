<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <el-card shadow="never" class="!rounded-xl !border-slate-200 bg-white">
      <div class="text-xs font-medium text-slate-500 mb-1">{{ $t('queue.currentCalling') }}</div>
      <div class="text-3xl font-extrabold text-blue-600">
        {{ stats.currentCallingNo ? `#${stats.currentCallingNo}` : $t('queue.noneCalling') }}
      </div>
    </el-card>

    <el-card shadow="never" class="!rounded-xl !border-slate-200 bg-white">
      <div class="text-xs font-medium text-slate-500 mb-1">{{ $t('queue.waitingCount') }}</div>
      <div class="text-3xl font-extrabold text-amber-600">
        {{ stats.waitingCount }} <span class="text-sm font-normal text-slate-500">{{ $t('queue.unitGroup') }}</span>
      </div>
    </el-card>

    <el-card shadow="never" class="!rounded-xl !border-slate-200 bg-white">
      <div class="text-xs font-medium text-slate-500 mb-1">{{ $t('queue.seatedCount') }}</div>
      <div class="text-3xl font-extrabold text-emerald-600">
        {{ stats.seatedCount }} <span class="text-sm font-normal text-slate-500">{{ $t('queue.unitGroup') }}</span>
      </div>
    </el-card>

    <el-card shadow="never" class="!rounded-xl !border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col justify-center">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs font-bold text-slate-700">{{ $t('queue.quickAction') }}</div>
          <div class="text-[11px] text-slate-500">{{ $t('queue.quickActionDesc') }}</div>
        </div>
        <el-button
          type="primary"
          size="large"
          class="!font-bold shadow-sm"
          :disabled="stats.waitingCount === 0"
          @click="$emit('callNext')"
        >
          <el-icon class="mr-1"><Bell /></el-icon>
          {{ $t('queue.callNextBtn') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue';
import type { AdminQueueStats } from '../../../types/queue';

defineProps<{ stats: AdminQueueStats }>();
defineEmits<{ (e: 'callNext'): void }>();
</script>
