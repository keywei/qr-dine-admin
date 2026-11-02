import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '../../api';

export const useCategoryAction = (onRefresh: () => void) => {
  const { t } = useI18n();
  const visible = ref(false);
  const newName = ref('');

  const createCategory = async () => {
    if (!newName.value.trim()) return;
    await api.post('/categories', { name: newName.value.trim() });
    ElMessage.success(t('menu.createCategorySuccess'));
    newName.value = '';
    onRefresh();
  };

  const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}`);
    ElMessage.success(t('menu.deleteCategorySuccess'));
    onRefresh();
  };

  return { visible, newName, createCategory, deleteCategory };
};
