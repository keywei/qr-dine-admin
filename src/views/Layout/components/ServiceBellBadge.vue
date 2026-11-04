<template>
  <el-popover placement="bottom-end" :width="320" trigger="click">
    <template #reference>
      <el-badge :value="activeCalls.length" :hidden="activeCalls.length === 0" class="cursor-pointer">
        <el-button circle :type="activeCalls.length > 0 ? 'warning' : 'default'">
          <span class="text-base">🛎️</span>
        </el-button>
      </el-badge>
    </template>

    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center pb-2 border-b border-slate-100">
        <span class="font-bold text-slate-800 text-sm">
          {{ $t('serviceBell.badgeTitle', { count: activeCalls.length }) }}
        </span>
        <el-button link type="primary" size="small" @click="fetchCalls">
          {{ $t('serviceBell.refresh') }}
        </el-button>
      </div>

      <div v-if="activeCalls.length === 0" class="py-6 text-center text-slate-400 text-xs">
        {{ $t('serviceBell.emptyTip') }}
      </div>

      <div v-else class="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        <div
          v-for="call in activeCalls"
          :key="call.id"
          class="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between gap-2 border border-slate-200"
        >
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1.5">
              <el-tag size="small" type="danger" effect="dark" class="font-bold">
                {{ $t('serviceBell.table', { code: call.table?.code }) }}
              </el-tag>
              <span class="font-semibold text-xs text-slate-800">
                {{ $te(`serviceBell.types.${call.type}`) ? $t(`serviceBell.types.${call.type}`) : call.type }}
              </span>
            </div>
            <span v-if="call.note" class="text-[11px] text-slate-500 truncate max-w-[170px]">{{ call.note }}</span>
            <span class="text-[10px] text-slate-400">{{ formatTime(call.createdAt) }}</span>
          </div>

          <el-button type="success" size="small" @click="complete(call.id)">
            {{ $t('serviceBell.completed') }}
          </el-button>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { useServiceBellAdmin } from '../../../composables/serviceBell/useServiceBellAdmin';

const { activeCalls, fetchCalls, complete } = useServiceBellAdmin();

const formatTime = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};
</script>
