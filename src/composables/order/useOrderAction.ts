import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '../../api';
import type { Order } from '../../types/order';

export const useOrderAction = (onSuccess: () => void) => {
  const { t } = useI18n();

  const confirmPayment = async (order: Order) => {
    await api.put(`/orders/${order.id}/confirm-payment`);
    ElMessage.success(t('orders.confirmPaymentSuccess', { orderNo: order.orderNo }));
    onSuccess();
  };

  const completeOrder = async (order: Order) => {
    await api.put(`/orders/${order.id}/status`, { status: 'COMPLETED' });
    ElMessage.success(t('orders.completeOrderSuccess', { orderNo: order.orderNo }));
    onSuccess();
  };

  const cancelOrder = async (order: Order) => {
    await api.put(`/orders/${order.id}/status`, { status: 'CANCELLED' });
    ElMessage.warning(t('orders.cancelSuccess', { orderNo: order.orderNo }));
    onSuccess();
  };

  return { confirmPayment, completeOrder, cancelOrder };
};
