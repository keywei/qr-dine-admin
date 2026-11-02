<template>
  <el-container class="layout-container">
    <LayoutSidebar
      :active-route="activeRoute"
      v-model:sound-enabled="soundEnabled"
    />

    <el-container class="main-wrapper">
      <LayoutHeader
        :title="currentRouteTitle"
        :user-name="authStore.user?.name"
        @logout="handleLogout"
      />

      <el-main class="content-body">
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

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #f8fafc;
}
.main-wrapper {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.content-body {
  padding: 20px;
  overflow-y: auto;
  background-color: #f1f5f9;
}
</style>
