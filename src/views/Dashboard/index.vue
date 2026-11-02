<template>
  <div class="flex flex-col gap-5">
    <StatsCards :stats="stats" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <TopDishesCard :dishes="stats.topDishes" />
      <StoreTipsCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStats } from '../../composables/dashboard/useDashboardStats';
import StatsCards from './components/StatsCards.vue';
import TopDishesCard from './components/TopDishesCard.vue';
import StoreTipsCard from './components/StoreTipsCard.vue';

const { stats } = useDashboardStats();
</script>
