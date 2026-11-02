import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '../../api';
import { validateImageFile, compressImageIfNeeded } from '../../utils/imageCompressor';

export const useImageUpload = (emit: (event: 'update:modelValue', value: string) => void) => {
  const { t } = useI18n();
  const uploading = ref(false);

  const handleFileSelect = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid && validation.errorKey) {
      ElMessage.error(t(validation.errorKey));
      return;
    }

    uploading.value = true;
    try {
      const { file: processedFile } = await compressImageIfNeeded(file);
      const formData = new FormData();
      formData.append('image', processedFile);

      const res = await api.post<{ filename: string; url: string }>('/upload', formData);
      if (res?.url) {
        emit('update:modelValue', res.url);
        ElMessage.success(t('menu.uploadSuccess'));
      }
    } catch {
      ElMessage.error(t('menu.uploadFailed'));
    } finally {
      uploading.value = false;
    }
  };

  const removeImage = () => {
    emit('update:modelValue', '');
  };

  return {
    uploading,
    handleFileSelect,
    removeImage,
  };
};
