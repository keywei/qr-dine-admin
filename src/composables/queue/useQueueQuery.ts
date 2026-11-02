import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '../../api';
import { initAdminSocket } from '../../socket';
import type { QueueTicket, AdminQueueStats, QueueFilterTab } from '../../types/queue';

export const useQueueQuery = () => {
  const tickets = ref<QueueTicket[]>([]);
  const loading = ref(false);
  const activeTab = ref<QueueFilterTab>('WAITING');
  const searchQuery = ref('');

  const stats = ref<AdminQueueStats>({
    waitingCount: 0,
    callingCount: 0,
    seatedCount: 0,
    currentCallingNo: null,
  });

  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await api.get<{ list?: QueueTicket[]; stats?: AdminQueueStats } | QueueTicket[]>('/admin/queue');
      if (Array.isArray(res)) {
        tickets.value = res;
      } else if (res && Array.isArray(res.list)) {
        tickets.value = res.list;
        if (res.stats) stats.value = res.stats;
      }
      const statsRes = await api.get<AdminQueueStats>('/admin/queue/stats').catch(() => null);
      if (statsRes) stats.value = statsRes;
    } catch {
      // 保持空陣列
    } finally {
      loading.value = false;
    }
  };

  const filteredTickets = computed(() => {
    return tickets.value.filter((t) => {
      const matchesTab =
        activeTab.value === 'ALL' ||
        (activeTab.value === 'WAITING' && (t.status === 'WAITING' || t.status === 'CALLING')) ||
        (activeTab.value === 'SEATED' && t.status === 'SEATED') ||
        (activeTab.value === 'CANCELLED' && (t.status === 'CANCELLED' || t.status === 'EXPIRED'));

      const kw = searchQuery.value.trim().toLowerCase();
      const matchesKw = !kw || String(t.ticketNo).includes(kw) || t.customerPhone.includes(kw);
      return matchesTab && matchesKw;
    });
  });

  onMounted(() => {
    fetchData();
    initAdminSocket().on('queue:updated', fetchData);
  });

  onUnmounted(() => {
    initAdminSocket().off('queue:updated', fetchData);
  });

  return { tickets, loading, activeTab, searchQuery, stats, filteredTickets, fetchData };
};
