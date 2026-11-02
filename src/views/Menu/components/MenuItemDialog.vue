<template>
  <el-dialog :model-value="visible" @update:model-value="$emit('update:visible', $event)" :title="isEdit ? $t('menu.editItem') : $t('menu.addItem')" width="680px">
    <el-form :model="form" label-width="100px">
      <el-form-item :label="$t('menu.itemFormCategory')" required>
        <el-select v-model="form.categoryId" :placeholder="$t('menu.itemFormCategoryPlaceholder')" style="width: 100%">
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('menu.itemFormName')" required>
        <el-input v-model="form.name" :placeholder="$t('menu.itemFormNamePlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('menu.itemFormPrice')" required>
        <el-input-number v-model="form.price" :min="0" :step="10" style="width: 180px" />
      </el-form-item>
      <el-form-item :label="$t('menu.itemFormDesc')">
        <el-input v-model="form.description" type="textarea" rows="2" :placeholder="$t('menu.itemFormDescPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('menu.itemFormImage')">
        <DishImageUploader v-model="form.imageUrl" />
      </el-form-item>
      <el-form-item :label="$t('menu.itemFormSort')">
        <el-input-number v-model="form.sortOrder" :min="0" style="width: 120px" />
      </el-form-item>

      <el-divider content-position="left">{{ $t('menu.specsSection') }}</el-divider>
      <div class="flex flex-col gap-3 bg-slate-50 p-3.5 rounded-lg">
        <div v-for="(grp, gIdx) in form.options" :key="gIdx" class="bg-white p-3 rounded-lg border border-slate-200">
          <div class="flex items-center gap-2.5 mb-2.5">
            <el-input v-model="grp.title" :placeholder="$t('menu.groupTitlePlaceholder')" style="width: 180px" />
            <el-select v-model="grp.type" style="width: 100px">
              <el-option :label="$t('menu.singleSelect')" value="SINGLE" />
              <el-option :label="$t('menu.multiSelect')" value="MULTIPLE" />
            </el-select>
            <el-checkbox v-model="grp.isRequired" :label="$t('menu.required')" />
            <el-button type="danger" link @click="form.options.splice(gIdx, 1)">{{ $t('menu.removeGroup') }}</el-button>
          </div>
          <div class="pl-2.5 flex flex-col gap-2">
            <div v-for="(opt, oIdx) in grp.options" :key="oIdx" class="flex items-center gap-2">
              <el-input v-model="opt.name" :placeholder="$t('menu.optNamePlaceholder')" style="width: 180px" />
              <el-input-number v-model="opt.extraPrice" :min="0" :step="5" style="width: 130px" />
              <el-button type="danger" text @click="grp.options.splice(oIdx, 1)"><el-icon><Delete /></el-icon></el-button>
            </div>
            <el-button type="primary" link size="small" @click="grp.options.push({ name: '', extraPrice: 0 })">
              <el-icon><Plus /></el-icon> {{ $t('menu.addOptItem') }}
            </el-button>
          </div>
        </div>
        <el-button type="primary" plain @click="form.options.push({ title: '', type: 'SINGLE', isRequired: false, options: [{ name: '', extraPrice: 0 }] })">
          <el-icon><Plus /></el-icon> {{ $t('menu.addSpecGroup') }}
        </el-button>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="$emit('save')">{{ $t('common.save') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue';
import DishImageUploader from './DishImageUploader.vue';
import type { Category, MenuItemForm } from '../../../types/menu';

defineProps<{ visible: boolean; isEdit: boolean; saving: boolean; form: MenuItemForm; categories: Category[] }>();
defineEmits<{ (e: 'update:visible', val: boolean): void; (e: 'save'): void }>();
</script>
