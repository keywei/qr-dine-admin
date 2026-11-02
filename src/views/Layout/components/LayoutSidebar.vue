<template>
  <el-aside width="240px" class="aside-menu">
    <div class="brand">
      <span class="brand-icon">🍜</span>
      <div class="brand-text">
        <span class="title">{{ $t('layout.brandTitle') }}</span>
        <span class="subtitle">{{ $t('layout.brandSubtitle') }}</span>
      </div>
    </div>

    <el-menu
      :default-active="activeRoute"
      router
      class="custom-menu"
      background-color="#0f172a"
      text-color="#94a3b8"
      active-text-color="#38bdf8"
    >
      <el-menu-item index="/orders">
        <el-icon><Bell /></el-icon>
        <span>{{ $t('layout.menuOrders') }}</span>
      </el-menu-item>
      <el-menu-item index="/menu">
        <el-icon><Food /></el-icon>
        <span>{{ $t('layout.menuMenu') }}</span>
      </el-menu-item>
      <el-menu-item index="/tables">
        <el-icon><Grid /></el-icon>
        <span>{{ $t('layout.menuTables') }}</span>
      </el-menu-item>
      <el-menu-item index="/dashboard">
        <el-icon><DataLine /></el-icon>
        <span>{{ $t('layout.menuDashboard') }}</span>
      </el-menu-item>
    </el-menu>

    <div class="aside-footer">
      <div class="sound-control">
        <span>{{ $t('layout.soundLabel') }}</span>
        <el-switch
          :model-value="soundEnabled"
          @update:model-value="$emit('update:soundEnabled', $event)"
          inline-prompt
          :active-text="$t('layout.soundOn')"
          :inactive-text="$t('layout.soundOff')"
        />
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { Bell, Food, Grid, DataLine } from '@element-plus/icons-vue';

defineProps<{ activeRoute: string; soundEnabled: boolean }>();
defineEmits<{ (e: 'update:soundEnabled', val: boolean): void }>();
</script>

<style scoped>
.aside-menu {
  background-color: #0f172a;
  color: #fff;
  display: flex;
  flex-direction: column;
}
.brand {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid #1e293b;
}
.brand-icon { font-size: 28px; }
.brand-text { display: flex; flex-direction: column; }
.brand-text .title { font-size: 16px; font-weight: 700; color: #f8fafc; }
.brand-text .subtitle { font-size: 11px; color: #64748b; }
.custom-menu { border-right: none; flex: 1; }
.custom-menu .el-menu-item { height: 52px; font-weight: 500; margin: 4px 10px; border-radius: 8px; }
.custom-menu .el-menu-item.is-active { background-color: #1e293b !important; color: #38bdf8 !important; }
.aside-footer { padding: 16px 20px; border-top: 1px solid #1e293b; background-color: #0b1120; }
.sound-control { display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #94a3b8; }
</style>
