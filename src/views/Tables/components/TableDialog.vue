<template>
  <el-dialog :model-value="visible" @update:model-value="$emit('update:visible', $event)" :title="isEdit ? $t('tables.editTable') : $t('tables.addTable')" width="420px">
    <el-form :model="form" label-width="80px">
      <el-form-item :label="$t('tables.tableCode')" required>
        <el-input v-model="form.code" :placeholder="$t('tables.tableCodePlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('tables.tableName')" required>
        <el-input v-model="form.name" :placeholder="$t('tables.tableNamePlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('tables.tableCapacity')">
        <el-input-number v-model="form.capacity" :min="1" :max="30" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="$emit('save')">{{ $t('common.save') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { TableForm } from '../../../types/table';

defineProps<{ visible: boolean; isEdit: boolean; form: TableForm }>();
defineEmits<{ (e: 'update:visible', val: boolean): void; (e: 'save'): void }>();
</script>
