<template>
  <div class="tables-page">
    <div class="page-header">
      <div class="header-left">
        <el-button type="primary" @click="openCreate">
          <el-icon><Plus /></el-icon> {{ $t('tables.addTable') }}
        </el-button>
        <el-button type="success" plain @click="batchPrintVisible = true">
          <el-icon><Printer /></el-icon> {{ $t('tables.batchPrint') }}
        </el-button>
      </div>
      <div class="header-right">
        <span class="table-count-text">{{ $t('tables.totalCount', { count: tables.length }) }}</span>
      </div>
    </div>

    <TakeoutQrCard :takeout-q-r="takeoutQR" @download="downloadQR" />

    <div v-loading="loading" class="tables-grid">
      <TableCard
        v-for="table in tablesWithQR"
        :key="table.code"
        :table="table"
        @download="downloadQR"
        @edit="openEdit"
        @delete="(id) => id && deleteTable(id)"
      />
    </div>

    <TableDialog
      v-model:visible="tableDialogVisible"
      :is-edit="isEdit"
      :form="form"
      @save="save"
    />

    <BatchPrintDialog
      v-model:visible="batchPrintVisible"
      :tables="tablesWithQR"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Printer } from '@element-plus/icons-vue';
import TakeoutQrCard from './components/TakeoutQrCard.vue';
import TableCard from './components/TableCard.vue';
import TableDialog from './components/TableDialog.vue';
import BatchPrintDialog from './components/BatchPrintDialog.vue';
import { useTableQuery } from '../../composables/table/useTableQuery';
import { useTableForm } from '../../composables/table/useTableForm';

const { tables, tablesWithQR, takeoutQR, loading, fetchTables } = useTableQuery();
const { visible: tableDialogVisible, isEdit, form, openCreate, openEdit, save, deleteTable } = useTableForm(fetchTables);

const batchPrintVisible = ref(false);

const downloadQR = (dataUrl: string, filename: string) => {
  if (!dataUrl) return;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.tables-page { display: flex; flex-direction: column; gap: 16px; }
.page-header { background: #fff; padding: 16px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.table-count-text { font-size: 14px; color: #64748b; font-weight: 500; }
.tables-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
</style>
