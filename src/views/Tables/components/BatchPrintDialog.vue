<template>
  <el-dialog :model-value="visible" @update:model-value="$emit('update:visible', $event)" :title="$t('tables.batchPrintTitle')" width="800px">
    <div class="print-toolbar">
      <el-button type="primary" size="large" @click="printWindow">
        <el-icon><Printer /></el-icon> {{ $t('tables.printNow') }}
      </el-button>
      <span class="print-tip">{{ $t('tables.printTip') }}</span>
    </div>

    <div class="print-preview-area" id="print-area">
      <div v-for="t in tables" :key="t.id" class="acrylic-stand-card">
        <div class="stand-store-name">{{ $t('tables.acrylicStoreName') }}</div>
        <div class="stand-tag">{{ $t('tables.acrylicTag') }}</div>
        <div class="stand-qr">
          <img :src="t.qrCode" class="print-qr-img" />
        </div>
        <div class="stand-table-code">{{ $t('tables.acrylicTableCode', { code: t.code }) }}</div>
        <div class="stand-table-name">({{ t.name }})</div>
        <div class="stand-footer">{{ $t('tables.acrylicFooter') }}</div>
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

<style scoped>
.print-toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.print-tip { font-size: 13px; color: #64748b; }
.print-preview-area { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-height: 500px; overflow-y: auto; padding: 10px; }
.acrylic-stand-card { border: 2px solid #334155; border-radius: 12px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; background: #fff; }
.stand-store-name { font-size: 18px; font-weight: 800; color: #1e293b; }
.stand-tag { font-size: 13px; color: #0369a1; font-weight: 600; margin-top: 4px; }
.stand-qr { margin: 14px 0; width: 160px; height: 160px; }
.print-qr-img { width: 100%; height: 100%; }
.stand-table-code { font-size: 24px; font-weight: 900; color: #dc2626; }
.stand-table-name { font-size: 13px; color: #64748b; }
.stand-footer { font-size: 11px; color: #94a3b8; margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 8px; width: 100%; }
</style>
