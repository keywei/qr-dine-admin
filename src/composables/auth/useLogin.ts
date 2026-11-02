import { ref, reactive, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import type { LoginForm } from '../../types/auth';

export const useLogin = () => {
  const router = useRouter();
  const { t } = useI18n();
  const authStore = useAuthStore();
  const formRef = useTemplateRef<FormInstance>('formRef');
  const loading = ref(false);

  const form = reactive<LoginForm>({
    username: '',
    password: '',
  });

  const rules: FormRules<LoginForm> = {
    username: [{ required: true, message: t('login.accountRequired'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.passwordRequired'), trigger: 'blur' }],
  };

  const handleLogin = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid) => {
      if (!valid) return;
      loading.value = true;
      try {
        const ok = await authStore.login(form);
        if (ok) {
          ElMessage.success(t('login.loginSuccess'));
          router.push('/orders');
        }
      } finally {
        loading.value = false;
      }
    });
  };

  return { form, rules, formRef, loading, handleLogin };
};
