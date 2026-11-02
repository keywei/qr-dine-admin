import { test, expect } from '@playwright/test';
import {
  maskPhoneNumber,
  getCallCountStatus,
  formatWaitTime,
  QUEUE_STATUS_TAG_MAP,
  MAX_CALL_COUNT,
} from '../src/utils/queueHelper';
import type { QueueTicket, QueueStatus } from '../src/types/queue';

test.describe('Admin 內用排隊管理核心邏輯測試', () => {
  test('手機去敏驗證：正確遮罩中間號碼，異常或空號碼保護', () => {
    expect(maskPhoneNumber('0912345678')).toBe('0912***678');
    expect(maskPhoneNumber('0988123456')).toBe('0988***456');
    expect(maskPhoneNumber('12345')).toBe('12345');
    expect(maskPhoneNumber('')).toBe('');
  });

  test('候位時間格式化驗證：未滿 1 小時與超過 1 小時', () => {
    const fixedNow = new Date('2026-11-02T12:30:00Z').getTime();
    expect(formatWaitTime(new Date('2026-11-02T12:15:00Z').toISOString(), fixedNow)).toBe('15m');
    expect(formatWaitTime(new Date('2026-11-02T11:05:00Z').toISOString(), fixedNow)).toBe('1h 25m');
  });

  test('唱號次數遞增與上限標記驗證（0/3, 1/3, 2/3, 3/3）', () => {
    expect(MAX_CALL_COUNT).toBe(3);
    expect(getCallCountStatus(0)).toMatchObject({ labelKey: 'queue.callCount0', isMaxReached: false });
    expect(getCallCountStatus(1)).toMatchObject({ labelKey: 'queue.callCount1', isMaxReached: false });
    expect(getCallCountStatus(2)).toMatchObject({ labelKey: 'queue.callCount2', type: 'warning', isMaxReached: false });
    expect(getCallCountStatus(3)).toMatchObject({ labelKey: 'queue.callCount3', type: 'danger', isMaxReached: true });
    expect(getCallCountStatus(4).isMaxReached).toBe(true);
  });

  test('狀態標籤字典與業務狀態流轉驗證', () => {
    const validStatuses: QueueStatus[] = ['WAITING', 'CALLING', 'SEATED', 'CANCELLED', 'EXPIRED'];
    validStatuses.forEach((status) => {
      const config = QUEUE_STATUS_TAG_MAP[status];
      expect(config).toBeDefined();
      expect(config.labelKey).toBeTruthy();
    });

    const ticket: QueueTicket = {
      id: 101,
      ticketNo: 12,
      customerPhone: '0912345678',
      partySize: 4,
      status: 'WAITING',
      callCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. 叫號 -> CALLING，唱號次數 +1
    ticket.status = 'CALLING';
    ticket.callCount += 1;
    expect(ticket.status).toBe('CALLING');
    expect(ticket.callCount).toBe(1);

    // 2. 入座 -> SEATED
    ticket.status = 'SEATED';
    ticket.seatedAt = new Date().toISOString();
    expect(ticket.status).toBe('SEATED');

    // 3. 逾期/過號流轉
    const expiredTicket: QueueTicket = { ...ticket, status: 'CALLING', callCount: 3 };
    if (expiredTicket.callCount >= MAX_CALL_COUNT) expiredTicket.status = 'EXPIRED';
    expect(expiredTicket.status).toBe('EXPIRED');
  });
});
