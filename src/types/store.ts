export interface StoreSetting {
  id?: number;
  storeCode?: string;
  name?: string;
  address?: string;
  phone?: string;
  businessHours?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreSettingForm {
  storeCode: string;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
}
