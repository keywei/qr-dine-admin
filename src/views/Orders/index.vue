<template>
  <div class="flex flex-col gap-4">
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

    <div v-loading="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 min-w-0">
      <el-empty v-if="filteredOrders.length === 0" class="col-span-full" :description="$t('orders.noOrders')" />
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
