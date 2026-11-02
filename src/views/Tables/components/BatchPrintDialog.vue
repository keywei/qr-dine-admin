<template>
  <el-dialog :model-value="visible" @update:model-value="$emit('update:visible', $event)" :title="$t('tables.batchPrintTitle')" width="800px">
    <div class="flex items-center gap-4 mb-5">
      <el-button type="primary" size="large" @click="printWindow">
        <el-icon><Printer /></el-icon> {{ $t('tables.printNow') }}
      </el-button>
      <span class="text-xs text-slate-500">{{ $t('tables.printTip') }}</span>
    </div>

    <div class="grid grid-cols-2 gap-5 max-h-[500px] overflow-y-auto p-2.5" id="print-area">
      <div v-for="t in tables" :key="t.id" class="border-2 border-slate-700 rounded-xl p-6 text-center flex flex-col items-center bg-white">
        <div class="text-lg font-extrabold text-slate-800">{{ $t('tables.acrylicStoreName') }}</div>
        <div class="text-xs text-sky-700 font-semibold mt-1">{{ $t('tables.acrylicTag') }}</div>
        <div class="my-3.5 w-40 h-40">
          <img :src="t.qrCode" class="w-full h-full" />
        </div>
        <div class="text-2xl font-black text-red-600">{{ $t('tables.acrylicTableCode', { code: t.code }) }}</div>
        <div class="text-xs text-slate-500">({{ t.name }})</div>
        <div class="text-[11px] text-slate-400 mt-2.5 border-t border-dashed border-slate-300 pt-2 w-full">{{ $t('tables.acrylicFooter') }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { Printer } from '@element-plus/icons-vue';
import type { TableQR } from '../../../types/table';

defineProps<{ visible: boolean; tables: TableQR[] }>();
defineEmits<{ (e: 'update:visible', val: boolean): void }>();

const printWindow = () => window.print();
</script>
