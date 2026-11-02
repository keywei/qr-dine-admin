<template>
  <div class="card-items">
    <div v-for="item in items" :key="item.id" class="order-item-row">
      <div class="item-name-col">
        <span class="item-name">{{ item.name }}</span>
        <span v-if="item.optionsText" class="item-options">({{ item.optionsText }})</span>
      </div>
      <div class="item-qty">x {{ item.quantity }}</div>
      <div class="item-price">NT$ {{ item.price * item.quantity }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem } from '../../../types/order';

defineProps<{ items: OrderItem[] }>();
</script>

<style scoped>
.card-items {
  border-top: 1px dashed #e2e8f0;
  border-bottom: 1px dashed #e2e8f0;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
}
.order-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.item-name-col { flex: 1; }
.item-name { font-weight: 600; color: #1e293b; }
.item-options { font-size: 12px; color: #64748b; margin-left: 6px; }
.item-qty { font-weight: 700; color: #0284c7; padding: 0 16px; }
.item-price { font-weight: 600; color: #334155; }
</style>
