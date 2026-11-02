export interface TopDish {
  name: string;
  totalQuantity: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrderCount: number;
  pendingPaymentCount: number;
  cookingCount: number;
  completedTodayCount: number;
  topDishes: TopDish[];
}
