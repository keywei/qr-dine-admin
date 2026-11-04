export interface StoreSetting {
  id?: number;
  storeCode?: string;
  name?: string;
  address?: string;
  phone?: string;
  businessHours?: string;
  serviceBellEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreSettingForm {
  storeCode: string;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  serviceBellEnabled: boolean;
}
