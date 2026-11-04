import api from '../api';

export interface ServiceCall {
  id: number;
  tableId: number;
  table?: { id: number; code: string; name: string };
  type: 'WATER' | 'UTENSILS' | 'CLEAN' | 'ASSIST' | 'OTHER';
  note?: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
}

export const serviceBellApi = {
  getActiveCalls: () => api.get<ServiceCall[]>('/service-bell/active'),
  completeCall: (id: number) => api.put<ServiceCall>(`/service-bell/${id}/complete`),
  setGlobalSwitch: (enabled: boolean) => api.patch('/service-bell/global', { enabled }),
  setTableSwitch: (tableId: number, enabled: boolean) => api.patch(`/service-bell/tables/${tableId}`, { enabled }),
};

