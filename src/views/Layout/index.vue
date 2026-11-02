<template>
  <el-container class="h-screen bg-slate-50">
    <LayoutSidebar
      :active-route="activeRoute"
      v-model:sound-enabled="soundEnabled"
    />

    <el-container direction="vertical" class="flex-1 !flex !flex-col overflow-hidden">
      <LayoutHeader
        :title="currentRouteTitle"
        :user-name="authStore.user?.name"
        @logout="handleLogout"
      />

      <el-main class="!p-5 overflow-y-auto !bg-slate-100 flex-1">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import LayoutSidebar from './components/LayoutSidebar.vue';
import LayoutHeader from './components/LayoutHeader.vue';
import { useLayoutNav } from '../../composables/layout/useLayoutNav';

const { authStore, soundEnabled, activeRoute, currentRouteTitle, handleLogout } = useLayoutNav();
</script>
