<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">🍽️</div>
        <h2>{{ $t('login.title') }}</h2>
        <p>{{ $t('login.subtitle') }}</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" size="large" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" :placeholder="$t('login.accountPlaceholder')" prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="$t('login.passwordPlaceholder')"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">
          {{ $t('login.submit') }}
        </el-button>
      </el-form>

      <div class="demo-tip">
        <span>{{ $t('login.demoTip') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '../../composables/auth/useLogin';

const { form, rules, loading, handleLogin } = useLogin();
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
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
