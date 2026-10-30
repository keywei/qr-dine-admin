<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">🍽️</div>
        <h2>智慧點餐系統 - 店家後台</h2>
        <p>請輸入管理員帳號與密碼進行登入</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" size="large" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="帳號 (預設: admin)" prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密碼 (預設: 123456)"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">
          登入系統
        </el-button>
      </el-form>

      <div class="demo-tip">
        <span>💡 測試提示：預設帳號 <b>admin</b> / 密碼 <b>123456</b></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const formRef = ref();
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
};

const handleLogin = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    loading.value = true;
    try {
      const ok = await authStore.login(form);
      if (ok) {
        ElMessage.success('登入成功');
        router.push('/orders');
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.login-card {
  width: 420px;
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.login-header h2 {
  font-size: 22px;
  color: #1e293b;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.login-header p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

.demo-tip {
  margin-top: 24px;
  padding: 10px 14px;
  background-color: #f1f5f9;
  border-radius: 8px;
  font-size: 13px;
  color: #475569;
  text-align: center;
}
</style>

