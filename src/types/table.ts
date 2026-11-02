export interface DiningTable {
  id: number;
  code: string;
  name: string;
  capacity: number;
  isActive: boolean;
  createdAt?: string;
}

export interface TableQR {
  id?: number;
  code?: string;
  name: string;
  capacity?: number;
  orderUrl: string;
  qrCode: string;
}

export interface BatchQRsResponse {
  tables: TableQR[];
  takeout: {
    name: string;
    orderUrl: string;
    qrCode: string;
  };
}

export interface TableForm {
  code: string;
  name: string;
  capacity: number;
}
