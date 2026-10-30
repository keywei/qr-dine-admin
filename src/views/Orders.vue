<template>
  <div class="orders-page">
    <!-- Filter bar -->
    <div class="filter-bar">
      <div class="filter-left">
        <el-radio-group v-model="statusFilter" @change="fetchOrders">
          <el-radio-button label="ALL">全部訂單 ({{ orders.length }})</el-radio-button>
          <el-radio-button label="PENDING_PAYMENT">
            待付款
            <el-badge :value="pendingPaymentCount" :hidden="pendingPaymentCount === 0" class="badge-dot" />
          </el-radio-button>
          <el-radio-button label="COOKING">
            製作中
            <el-badge :value="cookingCount" :hidden="cookingCount === 0" type="primary" class="badge-dot" />
          </el-radio-button>
          <el-radio-button label="COMPLETED">已完成</el-radio-button>
          <el-radio-button label="CANCELLED">已取消</el-radio-button>
        </el-radio-group>
      </div>

      <div class="filter-right">
        <el-select v-model="diningTypeFilter" placeholder="用餐方式" style="width: 130px" @change="fetchOrders">
          <el-option label="全部類型" value="ALL" />
          <el-option label="內用" value="DINE_IN" />
          <el-option label="外帶" value="TAKEOUT" />
        </el-select>
        <el-input
          v-model="searchQuery"
          placeholder="搜尋單號 / 電話 / 桌號"
          prefix-icon="Search"
          style="width: 220px"
          clearable
          @input="fetchOrders"
        />
        <el-button type="primary" plain @click="fetchOrders" :loading="loading">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>
    </div>

    <!-- Orders Kanban Grid -->
    <div v-loading="loading" class="order-grid">
      <el-empty v-if="filteredOrders.length === 0" description="目前沒有符合條件的訂單" />

      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
        :class="{
          'border-pending': order.status === 'PENDING_PAYMENT',
          'border-cooking': order.status === 'COOKING',
          'border-completed': order.status === 'COMPLETED',
          'border-cancelled': order.status === 'CANCELLED',
        }"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="table-tag">
            <el-tag
              v-if="order.diningType === 'DINE_IN'"
              size="large"
              effect="dark"
              type="danger"
              class="table-tag-text"
            >
              桌號 {{ order.table?.code || '內用' }}
            </el-tag>
            <el-tag v-else size="large" effect="dark" type="warning" class="table-tag-text">
              外帶取餐
            </el-tag>
            <span class="order-time">{{ formatTime(order.createdAt) }}</span>
          </div>

          <div class="status-tags">
            <!-- Payment status badge -->
            <el-tag v-if="order.paymentStatus === 'PAID'" type="success" size="small" effect="plain">
              已付款 ({{ order.paymentMethod === 'ONLINE' ? '線上' : '現金' }})
            </el-tag>
            <el-tag v-else type="danger" size="small" effect="dark">
              未付款 (現場櫃檯)
            </el-tag>

            <!-- Order lifecycle status -->
            <el-tag :type="getStatusTagType(order.status)" size="small">
              {{ getStatusLabel(order.status) }}
            </el-tag>
          </div>
        </div>

        <!-- Order Meta -->
        <div class="card-meta">
          <div class="order-no">單號：{{ order.orderNo }}</div>
          <div v-if="order.customerPhone" class="customer-phone">電話：{{ order.customerPhone }}</div>
        </div>

        <!-- Items list -->
        <div class="card-items">
          <div v-for="item in order.items" :key="item.id" class="order-item-row">
            <div class="item-name-col">
              <span class="item-name">{{ item.name }}</span>
              <span v-if="item.optionsText" class="item-options">({{ item.optionsText }})</span>
            </div>
            <div class="item-qty">x {{ item.quantity }}</div>
            <div class="item-price">NT$ {{ item.price * item.quantity }}</div>
          </div>
        </div>

        <!-- Customer note -->
        <div v-if="order.customerNote" class="card-note">
          <span class="note-label">備註：</span>
          <span class="note-text">{{ order.customerNote }}</span>
        </div>

        <!-- Footer Total & Actions -->
        <div class="card-footer">
          <div class="total-col">
            <span class="total-label">總計</span>
            <span class="total-price">NT$ {{ order.totalAmount }}</span>
          </div>

          <div class="actions-col">
            <!-- If PENDING_PAYMENT, allow Cashier to Confirm Cash Payment -->
            <el-button
              v-if="order.status === 'PENDING_PAYMENT'"
              type="success"
              size="default"
              @click="handleConfirmPayment(order)"
            >
              💰 確認收款
            </el-button>

            <!-- If COOKING, allow Kitchen to mark completed -->
            <el-button
              v-if="order.status === 'COOKING'"
              type="primary"
              size="default"
              @click="handleCompleteOrder(order)"
            >
              👨‍🍳 出餐完成
            </el-button>

            <!-- Cancel order button -->
            <el-popconfirm
              v-if="order.status !== 'COMPLETED' && order.status !== 'CANCELLED'"
              title="確定要取消此訂單嗎？"
              confirm-button-text="確認取消"
              cancel-button-text="返回"
              @confirm="handleCancelOrder(order)"
            >
              <template #reference>
                <el-button type="danger" text size="small">取消訂單</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import api from '../api';
import { getAdminSocket } from '../socket';

const orders = ref<any[]>([]);
const loading = ref(false);
const statusFilter = ref('ALL');
const diningTypeFilter = ref('ALL');
const searchQuery = ref('');

const pendingPaymentCount = computed(
  () => orders.value.filter((o) => o.status === 'PENDING_PAYMENT').length
);

const cookingCount = computed(() => orders.value.filter((o) => o.status === 'COOKING').length);

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    // Status filter
    if (statusFilter.value !== 'ALL' && o.status !== statusFilter.value) {
      return false;
    }
    // Dining type filter
    if (diningTypeFilter.value !== 'ALL' && o.diningType !== diningTypeFilter.value) {
      return false;
    }
    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchNo = o.orderNo?.toLowerCase().includes(q);
      const matchPhone = o.customerPhone?.toLowerCase().includes(q);
      const matchTable = o.table?.code?.toLowerCase().includes(q);
      if (!matchNo && !matchPhone && !matchTable) return false;
    }
    return true;
  });
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res: any = await api.get('/orders');
    if (res.success) {
      orders.value = res.data;
    }
  } catch (error: any) {
    console.error('Fetch orders failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleConfirmPayment = async (order: any) => {
  try {
    const res: any = await api.put(`/orders/${order.id}/confirm-payment`);
    if (res.success) {
      ElMessage.success(`訂單 #${order.orderNo} 已確認收款，送往廚房製作！`);
      fetchOrders();
    }
  } catch (error: any) {
    console.error(error);
  }
};

const handleCompleteOrder = async (order: any) => {
  try {
    const res: any = await api.put(`/orders/${order.id}/status`, { status: 'COMPLETED' });
    if (res.success) {
      ElMessage.success(`訂單 #${order.orderNo} 已完成出餐！`);
      fetchOrders();
    }
  } catch (error: any) {
    console.error(error);
  }
};

const handleCancelOrder = async (order: any) => {
  try {
    const res: any = await api.put(`/orders/${order.id}/status`, { status: 'CANCELLED' });
    if (res.success) {
      ElMessage.warning(`訂單 #${order.orderNo} 已取消`);
      fetchOrders();
    }
  } catch (error: any) {
    console.error(error);
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return '待收款';
    case 'COOKING':
      return '製作中';
    case 'COMPLETED':
      return '已完成';
    case 'CANCELLED':
      return '已取消';
    default:
      return status;
  }
};

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'warning';
    case 'COOKING':
      return 'primary';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'info';
    default:
      return '';
  }
};

const formatTime = (isoString: string) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  fetchOrders();

  const socket = getAdminSocket();
  socket.on('order:new', () => {
    fetchOrders();
  });
  socket.on('order:updated', () => {
    fetchOrders();
  });
});

onUnmounted(() => {
  const socket = getAdminSocket();
  socket.off('order:new');
  socket.off('order:updated');
});
</script>

<style scoped>
.orders-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-bar {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.order-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 18px;
}

.order-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-top: 4px solid #cbd5e1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.border-pending {
  border-top-color: #f59e0b;
}

.border-cooking {
  border-top-color: #3b82f6;
}

.border-completed {
  border-top-color: #10b981;
}

.border-cancelled {
  border-top-color: #94a3b8;
  opacity: 0.75;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-tag {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-tag-text {
  font-size: 15px;
  font-weight: 700;
  padding: 6px 12px;
}

.order-time {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.status-tags {
  display: flex;
  gap: 6px;
}

.card-meta {
  font-size: 13px;
  color: #475569;
  background-color: #f8fafc;
  padding: 6px 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
}

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

.item-name-col {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #1e293b;
}

.item-options {
  font-size: 12px;
  color: #64748b;
  margin-left: 6px;
}

.item-qty {
  font-weight: 700;
  color: #0284c7;
  padding: 0 16px;
}

.item-price {
  font-weight: 600;
  color: #334155;
}

.card-note {
  background: #fef3c7;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #92400e;
}

.note-label {
  font-weight: 700;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
}

.total-col {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.total-label {
  font-size: 13px;
  color: #64748b;
}

.total-price {
  font-size: 20px;
  font-weight: 800;
  color: #e11d48;
}

.actions-col {
  display: flex;
  gap: 8px;
  align-items: center;
}

.badge-dot {
  margin-left: 6px;
}
</style>
