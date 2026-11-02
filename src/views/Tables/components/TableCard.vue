<template>
  <div class="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center gap-3 border border-slate-200">
    <div class="w-full flex justify-between items-center">
      <div class="flex items-baseline gap-1.5">
        <span class="text-xl font-extrabold text-slate-900">{{ table.code }}</span>
        <span class="text-xs text-slate-500">({{ table.name }})</span>
      </div>
      <el-tag size="small" type="info">{{ $t('tables.capacityTag', { capacity: table.capacity || 4 }) }}</el-tag>
    </div>

    <div class="w-40 h-40 bg-slate-50 p-2 rounded-lg border border-slate-300 flex items-center justify-center">
      <el-image :src="table.qrCode" fit="contain" class="w-full h-full" :preview-src-list="[table.qrCode]" preview-teleported />
    </div>

    <div class="w-full text-center">
      <span class="text-[11px] text-slate-400 break-all">{{ table.orderUrl }}</span>
    </div>

    <div class="w-full flex justify-around border-t border-slate-100 pt-2">
      <el-button type="primary" link size="small" @click="$emit('download', table.qrCode, $t('common.tableQrFilename', { code: table.code }))">
        <el-icon><Download /></el-icon> {{ $t('tables.downloadQr') }}
      </el-button>
      <el-button type="info" link size="small" @click="$emit('edit', table)">{{ $t('common.edit') }}</el-button>
      <el-popconfirm :title="$t('tables.deleteTableConfirm')" @confirm="$emit('delete', table.id)">
        <template #reference>
          <el-button type="danger" link size="small">{{ $t('common.delete') }}</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue';
import type { TableQR } from '../../../types/table';

defineProps<{ table: TableQR }>();
defineEmits<{
  (e: 'download', url: string, filename: string): void;
  (e: 'edit', table: TableQR): void;
  (e: 'delete', id?: number): void;
}>();
</script>
