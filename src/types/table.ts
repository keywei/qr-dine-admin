export interface DiningTable {
  id: number;
  code: string;
  name: string;
  capacity: number;
  isActive: boolean;
  serviceBellEnabled?: boolean;
  createdAt?: string;
}

export interface TableQR {
  id?: number;
  code?: string;
  name: string;
  capacity?: number;
  serviceBellEnabled?: boolean;
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
