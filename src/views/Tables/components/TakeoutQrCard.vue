<template>
  <el-card class="takeout-card" shadow="never" v-if="takeoutQR">
    <div class="takeout-inner">
      <div class="takeout-qr-box">
        <el-image :src="takeoutQR.qrCode" class="qr-img" />
      </div>
      <div class="takeout-info">
        <div class="takeout-badge">
          <el-tag type="warning" effect="dark" size="large">{{ $t('tables.takeoutBadge') }}</el-tag>
        </div>
        <p class="takeout-desc">{{ $t('tables.takeoutDesc') }}</p>
        <div class="takeout-url">
          <span>{{ $t('tables.orderUrlPrefix') }}</span>
          <el-link :href="takeoutQR.orderUrl" target="_blank" type="primary">{{ takeoutQR.orderUrl }}</el-link>
        </div>
        <div class="takeout-actions">
          <el-button type="warning" plain size="small" @click="$emit('download', takeoutQR.qrCode, '外帶專屬QRCode.png')">
            <el-icon><Download /></el-icon> {{ $t('tables.downloadQr') }}
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue';
import type { BatchQRsResponse } from '../../../types/table';

defineProps<{ takeoutQR: BatchQRsResponse['takeout'] | null }>();
defineEmits<{ (e: 'download', url: string, filename: string): void }>();
</script>

<style scoped>
.takeout-card { border-radius: 12px; border-left: 6px solid #f59e0b; }
.takeout-inner { display: flex; align-items: center; gap: 24px; }
.takeout-qr-box { width: 130px; height: 130px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px; }
.qr-img { width: 100%; height: 100%; }
.takeout-info { display: flex; flex-direction: column; gap: 8px; }
.takeout-desc { font-size: 14px; color: #475569; margin: 0; }
.takeout-url { font-size: 13px; color: #64748b; }
</style>
