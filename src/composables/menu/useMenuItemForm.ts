import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '../../api';
import type { MenuItem, MenuItemForm } from '../../types/menu';

export const useMenuItemForm = (onSuccess: () => void) => {
  const { t } = useI18n();
  const visible = ref(false);
  const isEdit = ref(false);
  const saving = ref(false);
  const editingId = ref<number | null>(null);

  const form = reactive<MenuItemForm>({
    categoryId: undefined,
    name: '',
    description: '',
    price: 100,
    imageUrl: '',
    sortOrder: 0,
    options: [],
  });

  const openCreate = (defaultCategoryId?: number) => {
    isEdit.value = false;
    editingId.value = null;
    Object.assign(form, {
      categoryId: defaultCategoryId,
      name: '',
      description: '',
      price: 100,
      imageUrl: '',
      sortOrder: 0,
      options: [],
    });
    visible.value = true;
  };

  const openEdit = (item: MenuItem) => {
    isEdit.value = true;
    editingId.value = item.id;
    Object.assign(form, {
      categoryId: item.categoryId,
      name: item.name,
      description: item.description || '',
      price: item.price,
      imageUrl: item.imageUrl || '',
      sortOrder: item.sortOrder || 0,
      options: (item.options || []).map((g) => ({
        title: g.title,
        type: g.type,
        isRequired: g.isRequired,
        options: (g.options || []).map((o) => ({ name: o.name, extraPrice: o.extraPrice })),
      })),
    });
    visible.value = true;
  };

  const save = async () => {
    if (!form.name || !form.categoryId) {
      ElMessage.warning(t('menu.nameAndCategoryRequired'));
      return;
    }
    saving.value = true;
    try {
      if (isEdit.value && editingId.value) {
        await api.put(`/menu-items/${editingId.value}`, form);
      } else {
        await api.post('/menu-items', form);
      }
      ElMessage.success(t('menu.saveItemSuccess'));
      visible.value = false;
      onSuccess();
    } finally {
      saving.value = false;
    }
  };

  return { visible, isEdit, saving, form, openCreate, openEdit, save };
};
