<template>
  <div class="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
    <div class="w-[420px] bg-white p-10 rounded-2xl shadow-2xl">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🍽️</div>
        <h2 class="text-[22px] text-slate-800 m-0 mb-2 font-bold">{{ $t('login.title') }}</h2>
        <p class="text-slate-500 text-sm m-0">{{ $t('login.subtitle') }}</p>
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
        <el-button type="primary" :loading="loading" class="!w-full !mt-2.5 !h-11 text-base font-semibold" @click="handleLogin">
          {{ $t('login.submit') }}
        </el-button>
      </el-form>

      <div class="mt-6 px-3.5 py-2.5 bg-slate-100 rounded-lg text-xs text-slate-600 text-center">
        <span>{{ $t('login.demoTip') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '../../composables/auth/useLogin';

const { form, rules, loading, handleLogin } = useLogin();
</script>
