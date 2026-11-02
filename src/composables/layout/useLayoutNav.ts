import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElNotification } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import { initAdminSocket } from '../../socket';
import { playOrderBell } from '../../utils/sound';
import type { Order } from '../../types/order';

export const useLayoutNav = () => {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const authStore = useAuthStore();
  const soundEnabled = ref(true);

  const activeRoute = computed(() => route.path);

  const routeTitleMap: Record<string, string> = {
    '/orders': 'layout.menuOrders',
    '/menu': 'layout.menuMenu',
    '/tables': 'layout.menuTables',
    '/dashboard': 'layout.menuDashboard',
  };

  const currentRouteTitle = computed(() => t(routeTitleMap[route.path] || 'layout.brandTitle'));

  const onNewOrder = (order: Order) => {
    if (soundEnabled.value) playOrderBell();
    const msg = order.diningType === 'DINE_IN'
      ? t('layout.newOrderMessageDineIn', { table: order.table?.code || '內用', orderNo: order.orderNo, total: order.totalAmount })
      : t('layout.newOrderMessageTakeout', { orderNo: order.orderNo, total: order.totalAmount });

    ElNotification({
      title: t('layout.newOrderTitle'),
      message: msg,
      type: 'warning',
      duration: 6000,
      onClick: () => router.push('/orders'),
    });
  };

  onMounted(() => {
    initAdminSocket().on('order:new', onNewOrder);
  });

  onUnmounted(() => {
    initAdminSocket().off('order:new', onNewOrder);
  });

  return {
    authStore,
    soundEnabled,
    activeRoute,
    currentRouteTitle,
    handleLogout: () => authStore.logout(),
  };
};
