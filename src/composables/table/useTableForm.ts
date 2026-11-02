import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '../../api';
import type { TableForm } from '../../types/table';

export const useTableForm = (onSuccess: () => void) => {
  const { t } = useI18n();
  const visible = ref(false);
  const isEdit = ref(false);
  const editingId = ref<number | null>(null);

  const form = reactive<TableForm>({
    code: '',
    name: '',
    capacity: 4,
  });

  const openCreate = () => {
    isEdit.value = false;
    editingId.value = null;
    Object.assign(form, { code: '', name: '', capacity: 4 });
    visible.value = true;
  };

  const openEdit = (table: { id?: number; code?: string; name: string; capacity?: number }) => {
    isEdit.value = true;
    editingId.value = table.id || null;
    Object.assign(form, { code: table.code || '', name: table.name, capacity: table.capacity || 4 });
    visible.value = true;
  };

  const save = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      ElMessage.warning(t('tables.codeAndNameRequired'));
      return;
    }
    if (isEdit.value && editingId.value) {
      await api.put(`/tables/${editingId.value}`, form);
    } else {
      await api.post('/tables', form);
    }
    ElMessage.success(t('tables.saveSuccess'));
    visible.value = false;
    onSuccess();
  };

  const deleteTable = async (id: number) => {
    await api.delete(`/tables/${id}`);
    ElMessage.success(t('tables.deleteSuccess'));
    onSuccess();
  };

  return { visible, isEdit, form, openCreate, openEdit, save, deleteTable };
};
