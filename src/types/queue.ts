export type QueueStatus = 'WAITING' | 'CALLING' | 'SEATED' | 'CANCELLED' | 'EXPIRED';

export interface QueueTicket {
  id: number;
  ticketNo: number;
  customerPhone: string;
  partySize: number;
  status: QueueStatus;
  callCount: number;
  calledAt?: string | null;
  seatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminQueueStats {
  waitingCount: number;
  callingCount: number;
  seatedCount: number;
  currentCallingNo: number | null;
}

export type QueueFilterTab = 'ALL' | 'WAITING' | 'SEATED' | 'CANCELLED';
