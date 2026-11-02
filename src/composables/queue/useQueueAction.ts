import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '../../api';
import type { QueueTicket } from '../../types/queue';

export const useQueueAction = (onSuccess: () => void) => {
  const { t } = useI18n();
  const operatingId = ref<number | null>(null);

  const callTicket = async (ticket: QueueTicket) => {
    operatingId.value = ticket.id;
    try {
      await api.put(`/admin/queue/${ticket.id}/call`);
      ElMessage.success(t('queue.callSuccess', { no: ticket.ticketNo }));
      onSuccess();
    } finally {
      operatingId.value = null;
    }
  };

  const seatTicket = async (ticket: QueueTicket) => {
    operatingId.value = ticket.id;
    try {
      await api.put(`/admin/queue/${ticket.id}/seat`);
      ElMessage.success(t('queue.seatSuccess', { no: ticket.ticketNo }));
      onSuccess();
    } finally {
      operatingId.value = null;
    }
  };

  const cancelTicket = async (ticket: QueueTicket) => {
    operatingId.value = ticket.id;
    try {
      await api.put(`/admin/queue/${ticket.id}/cancel`);
      ElMessage.success(t('queue.cancelSuccess', { no: ticket.ticketNo }));
      onSuccess();
    } finally {
      operatingId.value = null;
    }
  };

  const callNext = async (nextTicket?: QueueTicket) => {
    try {
      if (nextTicket) {
        await callTicket(nextTicket);
      } else {
        await api.put('/admin/queue/next');
        ElMessage.success(t('queue.callNextSuccess'));
        onSuccess();
      }
    } catch {
      // API 錯誤攔截器會提示
    }
  };

  return { operatingId, callTicket, seatTicket, cancelTicket, callNext };
};
