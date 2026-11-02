<template>
  <el-dialog :model-value="visible" @update:model-value="$emit('update:visible', $event)" :title="$t('menu.categoryDialogTitle')" width="500px">
    <div class="flex gap-2.5">
      <el-input :model-value="newName" @update:model-value="$emit('update:newName', $event)" :placeholder="$t('menu.categoryNamePlaceholder')" style="flex: 1" />
      <el-button type="primary" @click="$emit('createCategory')">{{ $t('menu.addCategory') }}</el-button>
    </div>

    <el-table :data="categories" style="width: 100%; margin-top: 16px" border size="small">
      <el-table-column prop="name" :label="$t('menu.categoryName')" />
      <el-table-column prop="_count.items" :label="$t('menu.itemCount')" width="90" align="center" />
      <el-table-column :label="$t('common.actions')" width="100" align="center">
        <template #default="{ row }">
          <el-popconfirm :title="$t('menu.deleteCategoryConfirm')" @confirm="$emit('deleteCategory', row.id)">
            <template #reference>
              <el-button type="danger" link size="small">{{ $t('common.delete') }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Category } from '../../../types/menu';

defineProps<{ visible: boolean; newName: string; categories: Category[] }>();
defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'update:newName', val: string): void;
  (e: 'createCategory'): void;
  (e: 'deleteCategory', id: number): void;
}>();
</script>
