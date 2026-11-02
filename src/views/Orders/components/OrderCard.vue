<template>
  <div class="order-card" :class="'border-' + order.status.toLowerCase()">
    <div class="card-header">
      <div class="table-tag">
        <el-tag v-if="order.diningType === 'DINE_IN'" size="large" effect="dark" type="danger" class="table-tag-text">
          {{ $t('orders.tableLabel', { code: order.table?.code || '內用' }) }}
        </el-tag>
        <el-tag v-else size="large" effect="dark" type="warning" class="table-tag-text">{{ $t('orders.takeoutBadge') }}</el-tag>
        <span class="order-time">{{ formatTime(order.createdAt) }}</span>
      </div>
      <div class="status-tags">
        <el-tag v-if="order.paymentStatus === 'PAID'" type="success" size="small" effect="plain">
          {{ order.paymentMethod === 'ONLINE' ? $t('orders.paidOnline') : $t('orders.paidCash') }}
        </el-tag>
        <el-tag v-else type="danger" size="small" effect="dark">{{ $t('orders.unpaidCashier') }}</el-tag>
        <el-tag :type="statusTag.type" size="small">{{ $t(statusTag.labelKey) }}</el-tag>
      </div>
    </div>

    <div class="card-meta">
      <div class="order-no">{{ $t('orders.orderNoPrefix') }}{{ order.orderNo }}</div>
      <div v-if="order.customerPhone">{{ $t('orders.phonePrefix') }}{{ order.customerPhone }}</div>
    </div>

    <OrderItemList :items="order.items" />

    <div v-if="order.customerNote" class="card-note">
      <span class="note-label">{{ $t('orders.notePrefix') }}</span>
      <span>{{ order.customerNote }}</span>
    </div>

    <div class="card-footer">
      <div class="total-col">
        <span class="total-label">{{ $t('orders.totalPrefix') }}</span>
        <span class="total-price">NT$ {{ order.totalAmount }}</span>
      </div>
      <div class="actions-col">
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
const formatTime = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};
</script>

<style scoped>
.order-card { background: #fff; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-top: 4px solid #cbd5e1; display: flex; flex-direction: column; gap: 12px; }
.border-pending_payment { border-top-color: #f59e0b; }
.border-cooking { border-top-color: #3b82f6; }
.border-completed { border-top-color: #10b981; }
.border-cancelled { border-top-color: #94a3b8; opacity: 0.75; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.table-tag { display: flex; align-items: center; gap: 8px; }
.table-tag-text { font-size: 15px; font-weight: 700; }
.order-time { font-size: 12px; color: #64748b; }
.status-tags { display: flex; gap: 6px; }
.card-meta { font-size: 13px; color: #475569; background-color: #f8fafc; padding: 6px 10px; border-radius: 6px; display: flex; justify-content: space-between; }
.card-note { background: #fef3c7; padding: 6px 10px; border-radius: 6px; font-size: 13px; color: #92400e; }
.note-label { font-weight: 700; }
.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; }
.total-col { display: flex; align-items: baseline; gap: 6px; }
.total-label { font-size: 13px; color: #64748b; }
.total-price { font-size: 20px; font-weight: 800; color: #e11d48; }
.actions-col { display: flex; gap: 8px; align-items: center; }
</style>
