<template>
  <div class="border-t border-b border-dashed border-slate-200 py-2.5 flex flex-col gap-2 max-h-[220px] overflow-y-auto">
    <div v-for="item in items" :key="item.id" class="flex justify-between items-center text-sm">
      <div class="flex-1">
        <span class="font-semibold text-slate-800">{{ item.name }}</span>
        <span v-if="item.optionsText" class="text-xs text-slate-500 ml-1.5">({{ item.optionsText }})</span>
      </div>
      <div class="font-bold text-sky-600 px-4">x {{ item.quantity }}</div>
      <div class="font-semibold text-slate-700">NT$ {{ item.price * item.quantity }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem } from '../../../types/order';

defineProps<{ items: OrderItem[] }>();
</script>
