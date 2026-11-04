<template>
  <div class="bg-white rounded-xl p-4 shadow-sm border-t-4 flex flex-col gap-3 min-w-0 overflow-hidden" :class="borderClass">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <el-tag v-if="order.diningType === 'DINE_IN'" size="large" effect="dark" type="danger" class="text-[15px] font-bold">
          {{ $t('orders.tableLabel', { code: order.table?.code || $t('common.dineIn') }) }}
        </el-tag>
        <el-tag v-else size="large" effect="dark" type="warning" class="text-[15px] font-bold">{{ $t('orders.takeoutBadge') }}</el-tag>
        <span class="text-xs text-slate-500">{{ formatTime(order.createdAt) }}</span>
      </div>
      <div class="flex gap-1.5">
        <el-tag v-if="order.paymentStatus === 'PAID'" type="success" size="small" effect="plain">
          {{ order.paymentMethod === 'ONLINE' ? $t('orders.paidOnline') : $t('orders.paidCash') }}
        </el-tag>
        <el-tag v-else type="danger" size="small" effect="dark">{{ $t('orders.unpaidCashier') }}</el-tag>
        <el-tag :type="statusTag.type" size="small">{{ $t(statusTag.labelKey) }}</el-tag>
      </div>
    </div>

    <div class="text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md flex justify-between items-center gap-2 min-w-0 overflow-hidden">
      <div class="shrink-0 font-medium">{{ $t('orders.orderNoPrefix') }}{{ order.orderNo }}</div>
      <div v-if="order.customerPhone" class="break-all min-w-0 truncate text-right" :title="order.customerPhone">
        {{ $t('orders.phonePrefix') }}{{ order.customerPhone }}
      </div>
    </div>

    <div v-if="order.taxId || order.invoiceCarrier" class="flex flex-wrap gap-2 text-xs min-w-0 break-all">
      <el-tag v-if="order.taxId" size="small" type="warning" effect="plain" class="max-w-full">
        <span class="truncate">{{ $t('orders.taxIdPrefix') }}{{ order.taxId }}</span>
      </el-tag>
      <el-tag v-if="order.invoiceCarrier" size="small" type="info" effect="plain" class="max-w-full">
        <span class="truncate">{{ $t('orders.carrierPrefix') }}{{ order.invoiceCarrier }}</span>
      </el-tag>
    </div>

    <OrderItemList :items="order.items" />

    <div v-if="order.customerNote" class="bg-amber-100 px-2.5 py-1.5 rounded-md text-xs text-amber-800 break-all whitespace-pre-wrap overflow-hidden">
      <span class="font-bold">{{ $t('orders.notePrefix') }}</span>
      <span>{{ order.customerNote }}</span>
    </div>

    <div class="flex justify-between items-center mt-auto pt-2 border-t border-slate-100">
      <div class="flex items-baseline gap-1.5 shrink-0 whitespace-nowrap">
        <span class="text-xs text-slate-500 whitespace-nowrap">{{ $t('orders.totalPrefix') }}</span>
        <span class="text-lg font-black text-rose-600 whitespace-nowrap">NT$ {{ order.totalAmount }}</span>
      </div>
      <div class="flex gap-2 items-center shrink-0">
        <el-button v-if="order.status === 'PENDING_PAYMENT'" type="success" @click="$emit('confirmPayment', order)">
          {{ $t('orders.confirmPayment') }}
        </el-button>
        <el-button v-if="order.status === 'COOKING'" type="primary" @click="$emit('completeOrder', order)">
          {{ $t('orders.completeOrder') }}
        </el-button>
        <el-popconfirm v-if="order.status !== 'COMPLETED' && order.status !== 'CANCELLED'" :title="$t('orders.cancelConfirm')" @confirm="$emit('cancelOrder', order)">
          <template #reference><el-button type="danger" text size="small">{{ $t('orders.cancelOrder') }}</el-button></template>
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import OrderItemList from './OrderItemList.vue';
import { ORDER_STATUS_TAG_MAP, type Order } from '../../../types/order';

const props = defineProps<{ order: Order }>();
defineEmits<{ (e: 'confirmPayment', order: Order): void; (e: 'completeOrder', order: Order): void; (e: 'cancelOrder', order: Order): void }>();

const statusTag = computed(() => ORDER_STATUS_TAG_MAP[props.order.status] || { labelKey: props.order.status, type: '' });

const borderClass = computed(() => {
  switch (props.order.status) {
    case 'PENDING_PAYMENT': return 'border-t-amber-500';
    case 'COOKING': return 'border-t-blue-500';
    case 'COMPLETED': return 'border-t-emerald-500';
    case 'CANCELLED': return 'border-t-slate-400 opacity-75';
    default: return 'border-t-slate-300';
  }
});

const formatTime = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};
</script>
