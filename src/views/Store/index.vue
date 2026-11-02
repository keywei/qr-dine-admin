<template>
  <div class="max-w-4xl mx-auto">
    <el-card shadow="never" class="!rounded-xl !border-slate-200">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-base font-bold text-slate-800 m-0">{{ $t('store.dialogTitle') }}</h2>
            <p class="text-xs text-slate-500 mt-1 mb-0">{{ $t('store.subtitle') }}</p>
          </div>
          <el-button type="primary" :loading="saving" @click="save">
            {{ $t('common.save') }}
          </el-button>
        </div>
      </template>

      <el-form v-loading="loading" label-position="top" class="max-w-2xl py-2 space-y-4">
        <el-form-item :label="$t('store.storeCode')">
          <el-input v-model="form.storeCode" :placeholder="$t('store.storeCodePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('store.name')" required>
          <el-input v-model="form.name" :placeholder="$t('store.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('store.phone')">
          <el-input v-model="form.phone" :placeholder="$t('store.phonePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('store.address')">
          <el-input v-model="form.address" :placeholder="$t('store.addressPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('store.businessHours')">
          <el-input v-model="form.businessHours" :placeholder="$t('store.businessHoursPlaceholder')" />
        </el-form-item>
        <div class="pt-2">
          <el-button type="primary" :loading="saving" @click="save">
            {{ $t('common.save') }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStoreSetting } from '../../composables/store/useStoreSetting';

const { form, loading, saving, fetchSetting, save } = useStoreSetting();

onMounted(fetchSetting);
</script>
