<template>
  <div class="orders-page">
    <OrderFilterBar
      v-model:status-filter="statusFilter"
      v-model:dining-type-filter="diningTypeFilter"
      v-model:search-query="searchQuery"
      :pending-count="pendingCount"
      :cooking-count="cookingCount"
      :total-orders="orders.length"
      :loading="loading"
      @refresh="fetchOrders"
    />

    <div v-loading="loading" class="order-grid">
      <el-empty v-if="filteredOrders.length === 0" :description="$t('orders.noOrders')" />
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        @confirm-payment="confirmPayment"
        @complete-order="completeOrder"
        @cancel-order="cancelOrder"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderFilterBar from './components/OrderFilterBar.vue';
import OrderCard from './components/OrderCard.vue';
import { useOrderQuery } from '../../composables/order/useOrderQuery';
import { useOrderAction } from '../../composables/order/useOrderAction';

const {
  orders,
  loading,
  statusFilter,
  diningTypeFilter,
  searchQuery,
  pendingCount,
  cookingCount,
  filteredOrders,
  fetchOrders,
} = useOrderQuery();

const { confirmPayment, completeOrder, cancelOrder } = useOrderAction(fetchOrders);
</script>

<style scoped>
.orders-page { display: flex; flex-direction: column; gap: 16px; }
.order-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px; }
</style>
