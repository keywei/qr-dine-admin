import { ref, computed, onMounted } from 'vue';
import api from '../../api';
import type { Category, MenuItem } from '../../types/menu';

export const useMenuQuery = () => {
  const categories = ref<Category[]>([]);
  const menuItems = ref<MenuItem[]>([]);
  const loading = ref(false);
  const selectedCategory = ref<number | null>(null);
  const searchQuery = ref('');

  const filteredItems = computed(() => {
    return menuItems.value.filter((item) => {
      if (selectedCategory.value && item.categoryId !== selectedCategory.value) return false;
      if (searchQuery.value) {
        return item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      }
      return true;
    });
  });

  const fetchCategories = async () => {
    categories.value = await api.get<Category[]>('/categories');
  };

  const fetchMenuItems = async () => {
    loading.value = true;
    try {
      menuItems.value = await api.get<MenuItem[]>('/menu-items');
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchCategories();
    fetchMenuItems();
  });

  return {
    categories,
    menuItems,
    loading,
    selectedCategory,
    searchQuery,
    filteredItems,
    fetchCategories,
    fetchMenuItems,
  };
};
