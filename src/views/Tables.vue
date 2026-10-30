<template>
  <div class="tables-page">
    <div class="page-header">
      <div class="header-left">
        <el-button type="primary" @click="openCreateTableDialog">
          <el-icon><Plus /></el-icon> 新增桌號
        </el-button>
        <el-button type="success" plain @click="openBatchPrint">
          <el-icon><Printer /></el-icon> 批次列印桌牌 QR Code
        </el-button>
      </div>
      <div class="header-right">
        <span class="table-count-text">目前共 {{ tables.length }} 張桌位</span>
      </div>
    </div>

    <!-- Takeout Dedicated QR Code Section -->
    <el-card class="takeout-card" shadow="never">
      <div class="takeout-inner">
        <div class="takeout-qr-box" v-if="takeoutQR">
          <el-image :src="takeoutQR.qrCode" class="qr-img" />
        </div>
        <div class="takeout-info">
          <div class="takeout-badge">
            <el-tag type="warning" effect="dark" size="large">門市外帶專用 QR Code</el-tag>
          </div>
          <p class="takeout-desc">
            顧客掃描此碼即進入<b>外帶模式</b>，無須指定桌號，下單時可填寫外帶聯絡電話或備註。
          </p>
          <div class="takeout-url">
            <span>點餐連結：</span>
            <el-link :href="takeoutQR?.orderUrl" target="_blank" type="primary">
              {{ takeoutQR?.orderUrl }}
            </el-link>
          </div>
          <div class="takeout-actions">
            <el-button type="warning" plain size="small" @click="downloadQR(takeoutQR?.qrCode, '外帶專屬QRCode.png')">
              <el-icon><Download /></el-icon> 下載 QR Code 圖檔
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Table Grid -->
    <div v-loading="loading" class="tables-grid">
      <div v-for="table in tablesWithQR" :key="table.id" class="table-qr-card">
        <div class="card-head">
          <div class="table-title">
            <span class="table-code">{{ table.code }}</span>
            <span class="table-name">{{ table.name }}</span>
          </div>
          <el-tag size="small" effect="plain">{{ table.capacity }} 人桌</el-tag>
        </div>

        <div class="qr-container">
          <el-image :src="table.qrCode" class="table-qr-img" :preview-src-list="[table.qrCode]" preview-teleported />
        </div>

        <div class="card-url">
          <span class="url-text">{{ table.orderUrl }}</span>
        </div>

        <div class="card-actions">
          <el-button
            type="primary"
            link
            size="small"
            @click="downloadQR(table.qrCode, `桌號_${table.code}_點餐QR.png`)"
          >
            <el-icon><Download /></el-icon> 下載圖檔
          </el-button>
          <el-button type="info" link size="small" @click="openEditTableDialog(table)">
            編輯
          </el-button>
          <el-popconfirm title="確定要刪除此桌號？" @confirm="handleDeleteTable(table.id)">
            <template #reference>
              <el-button type="danger" link size="small">刪除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <!-- Create / Edit Table Dialog -->
    <el-dialog v-model="tableDialogVisible" :title="isEditTable ? '編輯桌號' : '新增桌號'" width="420px">
      <el-form :model="tableForm" label-width="80px">
        <el-form-item label="桌號代碼" required>
          <el-input v-model="tableForm.code" placeholder="例：A1、B2、VIP" />
        </el-form-item>
        <el-form-item label="桌位名稱" required>
          <el-input v-model="tableForm.name" placeholder="例：靠窗沙發桌" />
        </el-form-item>
        <el-form-item label="座位容量">
          <el-input-number v-model="tableForm.capacity" :min="1" :max="30" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tableDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveTable">儲存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Batch Print Modal -->
    <el-dialog v-model="batchPrintVisible" title="桌牌 QR Code 批次預覽與列印" width="800px">
      <div class="print-toolbar">
        <el-button type="primary" size="large" @click="printWindow">
          <el-icon><Printer /></el-icon> 立即列印全部桌牌
        </el-button>
        <span class="print-tip">提示：請在列印設定中選取「無邊界」或 A4 直式/橫式</span>
      </div>

      <div class="print-preview-area" id="print-area">
        <div v-for="t in tablesWithQR" :key="t.id" class="acrylic-stand-card">
          <div class="stand-store-name">🍜 美味食堂</div>
          <div class="stand-tag">手機掃碼點餐</div>
          <div class="stand-qr">
            <img :src="t.qrCode" class="print-qr-img" />
          </div>
          <div class="stand-table-code">桌號：{{ t.code }}</div>
          <div class="stand-table-name">({{ t.name }})</div>
          <div class="stand-footer">掃描 QR Code ➔ 選擇餐點 ➔ 結帳確認</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Printer, Download } from '@element-plus/icons-vue';
import api from '../api';

const tables = ref<any[]>([]);
const tablesWithQR = ref<any[]>([]);
const takeoutQR = ref<any>(null);
const loading = ref(false);

const tableDialogVisible = ref(false);
const isEditTable = ref(false);
const editingTableId = ref<number | null>(null);

const tableForm = reactive({
  code: '',
  name: '',
  capacity: 4,
});

const batchPrintVisible = ref(false);

const fetchTablesAndQRs = async () => {
  loading.value = true;
  try {
    const res: any = await api.get('/tables/batch/qrcodes');
    if (res.success && res.data) {
      tablesWithQR.value = res.data.tables;
      takeoutQR.value = res.data.takeout;
    }

    const tRes: any = await api.get('/tables');
    if (tRes.success) {
      tables.value = tRes.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openCreateTableDialog = () => {
  isEditTable.value = false;
  editingTableId.value = null;
  tableForm.code = '';
  tableForm.name = '';
  tableForm.capacity = 4;
  tableDialogVisible.value = true;
};

const openEditTableDialog = (table: any) => {
  isEditTable.value = true;
  editingTableId.value = table.id;
  tableForm.code = table.code;
  tableForm.name = table.name;
  tableForm.capacity = table.capacity;
  tableDialogVisible.value = true;
};

const handleSaveTable = async () => {
  if (!tableForm.code || !tableForm.name) {
    ElMessage.warning('請填寫桌號代碼與名稱');
    return;
  }

  try {
    if (isEditTable.value && editingTableId.value) {
      await api.put(`/tables/${editingTableId.value}`, tableForm);
      ElMessage.success('桌號更新成功');
    } else {
      await api.post('/tables', tableForm);
      ElMessage.success('桌號新增成功');
    }
    tableDialogVisible.value = false;
    fetchTablesAndQRs();
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteTable = async (id: number) => {
  try {
    await api.delete(`/tables/${id}`);
    ElMessage.success('桌號已刪除');
    fetchTablesAndQRs();
  } catch (error) {
    console.error(error);
  }
};

const downloadQR = (dataUrl: string, filename: string) => {
  if (!dataUrl) return;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const openBatchPrint = () => {
  batchPrintVisible.value = true;
};

const printWindow = () => {
  window.print();
};

onMounted(() => {
  fetchTablesAndQRs();
});
</script>

<style scoped>
.tables-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.table-count-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Takeout dedicated QR card */
.takeout-card {
  border-radius: 12px;
  border-left: 6px solid #f59e0b;
}

.takeout-inner {
  display: flex;
  align-items: center;
  gap: 24px;
}

.takeout-qr-box {
  width: 130px;
  height: 130px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-img {
  width: 100%;
  height: 100%;
}

.takeout-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.takeout-desc {
  font-size: 14px;
  color: #475569;
  margin: 0;
}

.takeout-url {
  font-size: 13px;
  color: #64748b;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.table-qr-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 1px solid #e2e8f0;
}

.card-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.table-code {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

.table-name {
  font-size: 12px;
  color: #64748b;
}

.qr-container {
  width: 160px;
  height: 160px;
  background-color: #f8fafc;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-qr-img {
  width: 100%;
  height: 100%;
}

.card-url {
  width: 100%;
  text-align: center;
}

.url-text {
  font-size: 11px;
  color: #94a3b8;
  word-break: break-all;
}

.card-actions {
  width: 100%;
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f1f5f9;
  padding-top: 8px;
}

/* Batch print styles */
.print-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.print-tip {
  font-size: 13px;
  color: #64748b;
}

.print-preview-area {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
}

.acrylic-stand-card {
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
}

.stand-store-name {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.stand-tag {
  font-size: 13px;
  color: #0369a1;
  font-weight: 600;
  margin-top: 4px;
}

.stand-qr {
  margin: 14px 0;
  width: 160px;
  height: 160px;
}

.print-qr-img {
  width: 100%;
  height: 100%;
}

.stand-table-code {
  font-size: 24px;
  font-weight: 900;
  color: #dc2626;
}

.stand-table-name {
  font-size: 13px;
  color: #64748b;
}

.stand-footer {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 10px;
  border-top: 1px dashed #cbd5e1;
  padding-top: 8px;
  width: 100%;
}

@media print {
  body * {
    visibility: hidden;
  }
  #print-area,
  #print-area * {
    visibility: visible;
  }
  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>

