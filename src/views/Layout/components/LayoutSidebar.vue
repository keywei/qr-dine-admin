<template>
  <el-aside width="240px" class="bg-slate-900 text-white flex flex-col shrink-0">
    <div class="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
      <span class="text-2xl">🍜</span>
      <div class="flex flex-col">
        <span class="text-base font-bold text-slate-50">{{ $t('layout.brandTitle') }}</span>
        <span class="text-[11px] text-slate-500">{{ $t('layout.brandSubtitle') }}</span>
      </div>
    </div>

    <el-menu
      :default-active="activeRoute"
      router
      class="custom-menu !border-r-0 flex-1"
      background-color="#0f172a"
      text-color="#94a3b8"
      active-text-color="#38bdf8"
    >
      <el-menu-item index="/orders">
        <el-icon><Bell /></el-icon>
        <span>{{ $t('layout.menuOrders') }}</span>
      </el-menu-item>
      <el-menu-item index="/queue">
        <el-icon><User /></el-icon>
        <span>{{ $t('layout.menuQueue') }}</span>
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
      <el-menu-item index="/store">
        <el-icon><Setting /></el-icon>
        <span>{{ $t('layout.menuStore') }}</span>
      </el-menu-item>
    </el-menu>

    <div class="px-5 py-4 border-t border-slate-800 bg-slate-950">
      <div class="flex items-center justify-between text-xs text-slate-400">
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
import { Bell, User, Food, Grid, DataLine, Setting } from '@element-plus/icons-vue';

defineProps<{ activeRoute: string; soundEnabled: boolean }>();
defineEmits<{ (e: 'update:soundEnabled', val: boolean): void }>();
</script>
