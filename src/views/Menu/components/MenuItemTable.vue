<template>
  <el-card shadow="never" class="!rounded-xl !border-none">
    <el-table :data="items" v-loading="loading" stripe style="width: 100%">
      <el-table-column :label="$t('menu.image')" width="100">
        <template #default="{ row }">
          <el-image
            :src="row.imageUrl || defaultImage"
            fit="cover"
            class="w-[54px] h-[54px] rounded-lg shadow-sm"
            :preview-src-list="[row.imageUrl || defaultImage]"
            preview-teleported
          />
        </template>
      </el-table-column>

      <el-table-column prop="name" :label="$t('menu.name')" min-width="160">
        <template #default="{ row }">
          <div class="flex flex-col">
            <span class="font-bold text-slate-800 text-sm">{{ row.name }}</span>
            <span class="text-xs text-slate-500 mt-0.5">{{ row.description || $t('common.noDescription') }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.category')" width="130">
        <template #default="{ row }">
          <el-tag effect="plain">{{ row.category?.name || $t('menu.unclassified') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.price')" width="110">
        <template #default="{ row }">
          <span class="font-bold text-sky-600">NT$ {{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.specs')" min-width="200">
        <template #default="{ row }">
          <div v-if="row.options?.length" class="flex flex-wrap gap-1">
            <el-tag v-for="grp in row.options" :key="grp.id" size="small" type="info" class="rounded">
              {{ grp.title }} ({{ $t('menu.specsCount', { count: grp.options.length }) }})
            </el-tag>
          </div>
          <span v-else class="text-xs text-slate-400">{{ $t('menu.noSpecs') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.status')" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.isAvailable"
            :active-text="$t('common.inStock')"
            :inactive-text="$t('common.outOfStock')"
            inline-prompt
            @change="$emit('toggleAvailability', row)"
          />
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.actions')" width="150" align="center">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="$emit('edit', row)">{{ $t('common.edit') }}</el-button>
          <el-popconfirm :title="$t('menu.deleteItemConfirm')" @confirm="$emit('delete', row.id)">
            <template #reference>
              <el-button type="danger" link size="small">{{ $t('common.delete') }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import type { MenuItem } from '../../../types/menu';

const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60';

defineProps<{ items: MenuItem[]; loading: boolean }>();
defineEmits<{
  (e: 'edit', item: MenuItem): void;
  (e: 'delete', id: number): void;
  (e: 'toggleAvailability', item: MenuItem): void;
}>();
</script>
