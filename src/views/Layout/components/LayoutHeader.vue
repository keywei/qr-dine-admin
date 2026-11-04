<template>
  <el-header class="!h-16 w-full bg-white border-b border-slate-200 flex items-center justify-between !px-6 shrink-0">
    <div class="flex items-center">
      <h3 class="m-0 text-lg font-bold text-slate-800">{{ title }}</h3>
    </div>
    <div class="flex items-center gap-4">
      <ServiceBellBadge />
      <div class="flex items-center gap-2">
        <el-avatar size="small" style="background-color: #3b82f6">{{ userName?.[0] || $t('common.adminAvatar') }}</el-avatar>
        <span class="text-sm font-semibold text-slate-700">{{ userName || $t('layout.userDefault') }}</span>
      </div>
      <el-button type="danger" link @click="$emit('logout')">
        <el-icon style="margin-right: 4px"><SwitchButton /></el-icon> {{ $t('layout.logout') }}
      </el-button>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { SwitchButton } from '@element-plus/icons-vue';
import ServiceBellBadge from './ServiceBellBadge.vue';

defineProps<{ title: string; userName?: string }>();
defineEmits<{ (e: 'logout'): void }>();
</script>
