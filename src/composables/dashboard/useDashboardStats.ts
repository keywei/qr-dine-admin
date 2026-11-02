import { ref, onMounted } from 'vue';
import api from '../../api';
import type { DashboardStats } from '../../types/dashboard';

export const useDashboardStats = () => {
  const stats = ref<DashboardStats>({
    todayRevenue: 0,
    todayOrderCount: 0,
    cookingCount: 0,
    pendingPaymentCount: 0,
    completedTodayCount: 0,
    topDishes: [],
  });

  const loading = ref(false);

  const fetchStats = async () => {
    loading.value = true;
    try {
      stats.value = await api.get<DashboardStats>('/stats/summary');
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchStats);

  return { stats, loading, fetchStats };
};
