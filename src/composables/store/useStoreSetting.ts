import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '../../api';
import type { StoreSetting, StoreSettingForm } from '../../types/store';

export const useStoreSetting = () => {
  const { t } = useI18n();
  const visible = ref(false);
  const loading = ref(false);
  const saving = ref(false);

  const form = reactive<StoreSettingForm>({
    storeCode: '',
    name: '',
    address: '',
    phone: '',
    businessHours: '',
  });

  const fetchSetting = async () => {
    loading.value = true;
    try {
      const data = await api.get<StoreSetting>('/store');
      if (data) {
        form.storeCode = data.storeCode || '';
        form.name = data.name || '';
        form.address = data.address || '';
        form.phone = data.phone || '';
        form.businessHours = data.businessHours || '';
      }
    } catch {
      ElMessage.error(t('store.loadError'));
    } finally {
      loading.value = false;
    }
  };

  const openDialog = async () => {
    visible.value = true;
    await fetchSetting();
  };

  const closeDialog = () => {
    visible.value = false;
  };

  const save = async () => {
    if (!form.name.trim()) {
      ElMessage.warning(t('store.nameRequired'));
      return;
    }
    saving.value = true;
    try {
      await api.put<StoreSetting>('/store', form);
      ElMessage.success(t('store.saveSuccess'));
      visible.value = false;
    } finally {
      saving.value = false;
    }
  };

  return {
    visible,
    loading,
    saving,
    form,
    fetchSetting,
    openDialog,
    closeDialog,
    save,
  };
};
