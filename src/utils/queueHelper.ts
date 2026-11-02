import type { QueueStatus } from '../types/queue';

export const MAX_CALL_COUNT = 3;

export const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length < 7) return phone || '';
  return phone.replace(/(\d{4})\d{3}(\d+)/, '$1***$2');
};

export const getCallCountStatus = (callCount: number): {
  labelKey: string;
  type: '' | 'info' | 'warning' | 'danger';
  isMaxReached: boolean;
} => {
  if (callCount <= 0) return { labelKey: 'queue.callCount0', type: 'info', isMaxReached: false };
  if (callCount === 1) return { labelKey: 'queue.callCount1', type: 'info', isMaxReached: false };
  if (callCount === 2) return { labelKey: 'queue.callCount2', type: 'warning', isMaxReached: false };
  return { labelKey: 'queue.callCount3', type: 'danger', isMaxReached: true };
};

export const formatWaitTime = (createdAt: string, nowMs = Date.now()): string => {
  if (!createdAt) return '0m';
  const start = new Date(createdAt).getTime();
  const diffMinutes = Math.max(0, Math.floor((nowMs - start) / 60000));
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return `${hours}h ${mins}m`;
};

export const QUEUE_STATUS_TAG_MAP: Record<QueueStatus, { labelKey: string; type: '' | 'primary' | 'warning' | 'success' | 'info' | 'danger' }> = {
  WAITING: { labelKey: 'queue.statusWaiting', type: 'warning' },
  CALLING: { labelKey: 'queue.statusCalling', type: 'primary' },
  SEATED: { labelKey: 'queue.statusSeated', type: 'success' },
  CANCELLED: { labelKey: 'queue.statusCancelled', type: 'info' },
  EXPIRED: { labelKey: 'queue.statusExpired', type: 'danger' },
};
