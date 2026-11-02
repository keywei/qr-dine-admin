<template>
  <div class="flex flex-col gap-4">
    <div class="bg-white px-5 py-4 rounded-xl flex justify-between items-center shadow-sm">
      <div class="flex gap-3">
        <el-button type="primary" @click="openCreate">
          <el-icon><Plus /></el-icon> {{ $t('tables.addTable') }}
        </el-button>
        <el-button type="success" plain @click="batchPrintVisible = true">
          <el-icon><Printer /></el-icon> {{ $t('tables.batchPrint') }}
        </el-button>
      </div>
      <div>
        <span class="text-sm text-slate-500 font-medium">{{ $t('tables.totalCount', { count: tables.length }) }}</span>
      </div>
    </div>

    <TakeoutQrCard :takeout-q-r="takeoutQR" @download="downloadQR" />

    <div v-loading="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
