import type { QueueTicket } from '../../src/types/queue';

export const createMockFile = (name: string, sizeInBytes: number, type: string): File => {
  const buffer = new Uint8Array(sizeInBytes);
  return new File([buffer], name, { type });
};

export const createMockQueueTicket = (overrides: Partial<QueueTicket> = {}): QueueTicket => ({
  id: 101,
  ticketNo: 12,
  customerPhone: '0912345678',
  partySize: 4,
  status: 'WAITING',
  callCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

