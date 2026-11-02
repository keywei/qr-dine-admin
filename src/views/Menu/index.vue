<template>
  <div class="flex flex-col gap-4">
    <MenuHeader
      :categories="categories"
      v-model:selected-category="selectedCategory"
      v-model:search-query="searchQuery"
      @open-create-item="openCreate"
      @open-category="catVisible = true"
    />

    <MenuItemTable
      :items="filteredItems"
      :loading="loading"
      @edit="openEdit"
      @delete="handleDeleteItem"
      @toggle-availability="handleToggleAvailability"
    />

    <MenuItemDialog
      v-model:visible="itemVisible"
      :is-edit="isEdit"
      :saving="saving"
      :form="form"
      :categories="categories"
      @save="save"
    />

    <CategoryDialog
      v-model:visible="catVisible"
      v-model:new-name="catNewName"
      :categories="categories"
      @create-category="createCategory"
      @delete-category="deleteCategory"
    />
  </div>
</template>

<script setup lang="ts">
import MenuHeader from './components/MenuHeader.vue';
import MenuItemTable from './components/MenuItemTable.vue';
import MenuItemDialog from './components/MenuItemDialog.vue';
import CategoryDialog from './components/CategoryDialog.vue';
import { useMenuQuery } from '../../composables/menu/useMenuQuery';
import { useMenuItemForm } from '../../composables/menu/useMenuItemForm';
import { useCategoryAction } from '../../composables/menu/useCategoryAction';
import api from '../../api';

const { categories, selectedCategory, searchQuery, loading, filteredItems, fetchMenuItems, fetchCategories } = useMenuQuery();

const { visible: itemVisible, isEdit, saving, form, openCreate, openEdit, save } = useMenuItemForm(fetchMenuItems);

const { visible: catVisible, newName: catNewName, createCategory, deleteCategory } = useCategoryAction(fetchCategories);

const handleDeleteItem = async (id: number) => {
  await api.delete(`/menu-items/${id}`);
  fetchMenuItems();
};

const handleToggleAvailability = async (item: any) => {
  await api.patch(`/menu-items/${item.id}/availability`);
};
</script>
