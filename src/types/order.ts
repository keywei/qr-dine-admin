export type OrderStatus = 'PENDING_PAYMENT' | 'COOKING' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'LINE_PAY' | 'CREDIT_CARD' | 'ONLINE';
export type DiningType = 'DINE_IN' | 'TAKEOUT';

export interface OrderItem {
  id: number;
  menuItemId?: number | null;
  name: string;
  price: number;
  quantity: number;
  optionsText?: string | null;
}

export interface Table {
  id: number;
  code: string;
  capacity?: number;
}

export interface Order {
  id: number;
  orderNo: string;
  tableId?: number | null;
  table?: Table | null;
  diningType: DiningType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  customerNote?: string | null;
  customerPhone?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export const ORDER_STATUS_TAG_MAP: Record<OrderStatus, { labelKey: string; type: '' | 'warning' | 'primary' | 'success' | 'info' }> = {
  PENDING_PAYMENT: { labelKey: 'orders.statusPending', type: 'warning' },
  COOKING: { labelKey: 'orders.statusCooking', type: 'primary' },
  COMPLETED: { labelKey: 'orders.statusCompleted', type: 'success' },
  CANCELLED: { labelKey: 'orders.statusCancelled', type: 'info' },
};
