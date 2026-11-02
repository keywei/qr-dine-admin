<template>
  <el-card shadow="never" class="table-card">
    <el-table :data="items" v-loading="loading" stripe style="width: 100%">
      <el-table-column :label="$t('menu.image')" width="100">
        <template #default="{ row }">
          <el-image
            :src="row.imageUrl || defaultImage"
            fit="cover"
            class="dish-img-thumb"
            :preview-src-list="[row.imageUrl || defaultImage]"
            preview-teleported
          />
        </template>
      </el-table-column>

      <el-table-column prop="name" :label="$t('menu.name')" min-width="160">
        <template #default="{ row }">
          <div class="dish-name-cell">
            <span class="name-text">{{ row.name }}</span>
            <span class="desc-text">{{ row.description || '無描述' }}</span>
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
          <span class="price-text">NT$ {{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('menu.specs')" min-width="200">
        <template #default="{ row }">
          <div v-if="row.options?.length" class="specs-wrapper">
            <el-tag v-for="grp in row.options" :key="grp.id" size="small" type="info" class="spec-tag">
              {{ grp.title }} ({{ $t('menu.specsCount', { count: grp.options.length }) }})
            </el-tag>
          </div>
          <span v-else class="text-muted">{{ $t('menu.noSpecs') }}</span>
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

<style scoped>
.table-card { border-radius: 12px; border: none; }
.dish-img-thumb { width: 54px; height: 54px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.dish-name-cell { display: flex; flex-direction: column; }
.name-text { font-weight: 700; color: #1e293b; font-size: 14px; }
.desc-text { font-size: 12px; color: #64748b; margin-top: 2px; }
.price-text { font-weight: 700; color: #0284c7; }
.specs-wrapper { display: flex; flex-wrap: wrap; gap: 4px; }
.spec-tag { border-radius: 4px; }
.text-muted { font-size: 12px; color: #94a3b8; }
</style>
