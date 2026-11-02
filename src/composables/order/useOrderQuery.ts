import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '../../api';
import { getAdminSocket } from '../../socket';
import type { Order } from '../../types/order';

export const useOrderQuery = () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const statusFilter = ref<string>('ALL');
  const diningTypeFilter = ref<string>('ALL');
  const searchQuery = ref('');

  const pendingCount = computed(() => orders.value.filter((o) => o.status === 'PENDING_PAYMENT').length);
  const cookingCount = computed(() => orders.value.filter((o) => o.status === 'COOKING').length);

  const filteredOrders = computed(() => {
    return orders.value.filter((o) => {
      if (statusFilter.value !== 'ALL' && o.status !== statusFilter.value) return false;
      if (diningTypeFilter.value !== 'ALL' && o.diningType !== diningTypeFilter.value) return false;
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
      orders.value = await api.get<Order[]>('/orders');
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchOrders();
    const socket = getAdminSocket();
    socket.on('order:new', fetchOrders);
    socket.on('order:updated', fetchOrders);
  });

  onUnmounted(() => {
    const socket = getAdminSocket();
    socket.off('order:new', fetchOrders);
    socket.off('order:updated', fetchOrders);
  });

  return {
    orders,
    loading,
    statusFilter,
    diningTypeFilter,
    searchQuery,
    pendingCount,
    cookingCount,
    filteredOrders,
    fetchOrders,
  };
};
