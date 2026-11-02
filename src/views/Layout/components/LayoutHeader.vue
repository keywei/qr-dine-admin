<template>
  <el-header class="top-header">
    <div class="header-left">
      <h3 class="page-title">{{ title }}</h3>
    </div>
    <div class="header-right">
      <div class="user-badge">
        <el-avatar size="small" style="background-color: #3b82f6">{{ userName?.[0] || '管' }}</el-avatar>
        <span class="user-name">{{ userName || $t('layout.userDefault') }}</span>
      </div>
      <el-button type="danger" link @click="$emit('logout')">
        <el-icon style="margin-right: 4px"><SwitchButton /></el-icon> {{ $t('layout.logout') }}
      </el-button>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { SwitchButton } from '@element-plus/icons-vue';

defineProps<{ title: string; userName?: string }>();
defineEmits<{ (e: 'logout'): void }>();
</script>

<style scoped>
.top-header {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.page-title { margin: 0; font-size: 18px; font-weight: 700; color: #1e293b; }
.header-right { display: flex; align-items: center; gap: 20px; }
.user-badge { display: flex; align-items: center; gap: 8px; }
.user-name { font-size: 14px; font-weight: 600; color: #334155; }
</style>
