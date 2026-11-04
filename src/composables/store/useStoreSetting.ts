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
    serviceBellEnabled: true,
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
        form.serviceBellEnabled = data.serviceBellEnabled ?? true;
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
      await api.put('/store', form);
      // 同步全店服務鈴總開關
      await api.patch('/service-bell/global', { enabled: form.serviceBellEnabled });
      ElMessage.success(t('store.saveSuccess'));
      closeDialog();
    } catch {
      ElMessage.error(t('store.saveError'));
    } finally {
      saving.value = false;
    }
  };

  return { form, visible, loading, saving, fetchSetting, openDialog, closeDialog, save };
};
