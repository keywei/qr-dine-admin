<template>
  <div class="dashboard-page" v-loading="loading">
    <StatsCards :stats="stats" />

    <div class="dashboard-grid">
      <TopDishesCard :dishes="stats.topDishes || []" @refresh="fetchStats" />
      <StoreTipsCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatsCards from './components/StatsCards.vue';
import TopDishesCard from './components/TopDishesCard.vue';
import StoreTipsCard from './components/StoreTipsCard.vue';
import { useDashboardStats } from '../../composables/dashboard/useDashboardStats';

const { stats, loading, fetchStats } = useDashboardStats();
</script>

<style scoped>
.dashboard-page { display: flex; flex-direction: column; gap: 20px; }
.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
</style>
