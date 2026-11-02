<template>
  <div class="bg-white px-5 py-4 rounded-xl flex justify-between items-center shadow-sm">
    <div class="flex gap-3 items-center">
      <el-button type="primary" @click="$emit('openCreateItem')">
        <el-icon><Plus /></el-icon> {{ $t('menu.addItem') }}
      </el-button>
      <el-button type="success" plain @click="$emit('openCategory')">
        <el-icon><FolderAdd /></el-icon> {{ $t('menu.manageCategory') }}
      </el-button>
    </div>

    <div class="flex gap-3 items-center">
      <el-select
        :model-value="selectedCategory"
        @update:model-value="$emit('update:selectedCategory', $event)"
        :placeholder="$t('menu.filterCategory')"
        style="width: 180px"
        clearable
      >
        <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
      </el-select>
      <el-input
        :model-value="searchQuery"
        @update:model-value="$emit('update:searchQuery', $event)"
        :placeholder="$t('menu.searchPlaceholder')"
        prefix-icon="Search"
        style="width: 220px"
        clearable
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, FolderAdd } from '@element-plus/icons-vue';
import type { Category } from '../../../types/menu';

defineProps<{
  categories: Category[];
  selectedCategory: number | null;
  searchQuery: string;
}>();

defineEmits<{
  (e: 'update:selectedCategory', val: number | null): void;
  (e: 'update:searchQuery', val: string): void;
  (e: 'openCreateItem'): void;
  (e: 'openCategory'): void;
}>();
</script>
