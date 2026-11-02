<template>
  <div class="table-qr-card">
    <div class="card-head">
      <div class="table-title">
        <span class="table-code">{{ table.code }}</span>
        <span class="table-name">{{ table.name }}</span>
      </div>
      <el-tag size="small" effect="plain">{{ $t('tables.capacityTag', { capacity: table.capacity || 4 }) }}</el-tag>
    </div>

    <div class="qr-container">
      <el-image :src="table.qrCode" class="table-qr-img" :preview-src-list="[table.qrCode]" preview-teleported />
    </div>

    <div class="card-url">
      <span class="url-text">{{ table.orderUrl }}</span>
    </div>

    <div class="card-actions">
      <el-button type="primary" link size="small" @click="$emit('download', table.qrCode, `桌號_${table.code}.png`)">
        <el-icon><Download /></el-icon> {{ $t('tables.downloadQr') }}
      </el-button>
      <el-button type="info" link size="small" @click="$emit('edit', table)">
        {{ $t('common.edit') }}
      </el-button>
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

<style scoped>
.table-qr-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 1px solid #e2e8f0;
}
.card-head { width: 100%; display: flex; justify-content: space-between; align-items: center; }
.table-title { display: flex; align-items: baseline; gap: 6px; }
.table-code { font-size: 20px; font-weight: 800; color: #0f172a; }
.table-name { font-size: 12px; color: #64748b; }
.qr-container { width: 160px; height: 160px; background-color: #f8fafc; padding: 8px; border-radius: 8px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; }
.table-qr-img { width: 100%; height: 100%; }
.card-url { width: 100%; text-align: center; }
.url-text { font-size: 11px; color: #94a3b8; word-break: break-all; }
.card-actions { width: 100%; display: flex; justify-content: space-around; border-top: 1px solid #f1f5f9; padding-top: 8px; }
</style>
