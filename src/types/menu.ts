export interface ItemOption {
  id?: number;
  name: string;
  extraPrice: number;
}

export interface ItemOptionGroup {
  id?: number;
  title: string;
  type: 'SINGLE' | 'MULTIPLE';
  isRequired: boolean;
  options: ItemOption[];
}

export interface MenuItem {
  id: number;
  categoryId: number;
  category?: { id: number; name: string };
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
  options: ItemOptionGroup[];
}

export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  _count?: { items: number };
}

export interface MenuItemForm {
  categoryId: number | undefined;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sortOrder: number;
  options: ItemOptionGroup[];
}
