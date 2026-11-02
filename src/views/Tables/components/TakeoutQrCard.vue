<template>
  <el-card class="!rounded-xl border-l-[6px] !border-l-amber-500" shadow="never" v-if="takeoutQR">
    <div class="flex items-center gap-6">
      <div class="w-[130px] h-[130px] bg-white border border-slate-200 rounded-lg p-1.5">
        <el-image :src="takeoutQR.qrCode" class="w-full h-full" />
      </div>
      <div class="flex flex-col gap-2">
        <div>
          <el-tag type="warning" effect="dark" size="large">{{ $t('tables.takeoutBadge') }}</el-tag>
        </div>
        <p class="text-sm text-slate-600 m-0">{{ $t('tables.takeoutDesc') }}</p>
        <div class="text-xs text-slate-500">
          <span>{{ $t('tables.orderUrlPrefix') }}</span>
          <el-link :href="takeoutQR.orderUrl" target="_blank" type="primary">{{ takeoutQR.orderUrl }}</el-link>
        </div>
        <div>
          <el-button type="warning" plain size="small" @click="$emit('download', takeoutQR.qrCode, $t('common.takeoutQrFilename'))">
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
