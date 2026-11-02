<template>
  <el-dialog
    v-model="visible"
    :title="$t('store.dialogTitle')"
    width="520px"
    destroy-on-close
  >
    <el-form v-loading="loading" label-position="top" class="space-y-3">
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
    </el-form>
    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="save">{{ $t('common.save') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useStoreSetting } from '../../../composables/store/useStoreSetting';

const { visible, loading, saving, form, openDialog, save } = useStoreSetting();

defineExpose({ open: openDialog });
</script>
