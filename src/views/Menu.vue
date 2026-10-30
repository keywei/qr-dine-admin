<template>
  <div class="menu-page">
    <div class="page-header">
      <div class="header-left">
        <el-button type="primary" @click="openCreateItemDialog">
          <el-icon><Plus /></el-icon> 新增餐點
        </el-button>
        <el-button type="success" plain @click="openCategoryDialog">
          <el-icon><FolderAdd /></el-icon> 管理分類
        </el-button>
      </div>

      <div class="header-right">
        <el-select
          v-model="selectedCategory"
          placeholder="依分類篩選"
          style="width: 180px"
          clearable
          @change="fetchMenuItems"
        >
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
        <el-input
          v-model="searchQuery"
          placeholder="搜尋餐點名稱"
          prefix-icon="Search"
          style="width: 220px"
          clearable
        />
      </div>
    </div>

    <!-- Menu Items Table -->
    <el-card shadow="never" class="table-card">
      <el-table :data="filteredItems" v-loading="loading" stripe style="width: 100%">
        <el-table-column label="圖片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.imageUrl || defaultDishImage"
              fit="cover"
              class="dish-img-thumb"
              :preview-src-list="[row.imageUrl || defaultDishImage]"
              preview-teleported
            />
          </template>
        </el-table-column>

        <el-table-column prop="name" label="餐點品名" min-width="160">
          <template #default="{ row }">
            <div class="dish-name-cell">
              <span class="name-text">{{ row.name }}</span>
              <span class="desc-text">{{ row.description || '無描述' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="分類" width="130">
          <template #default="{ row }">
            <el-tag effect="plain">{{ row.category?.name || '未分類' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="單價" width="110">
          <template #default="{ row }">
            <span class="price-text">NT$ {{ row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="客製規格" min-width="200">
          <template #default="{ row }">
            <div v-if="row.options && row.options.length > 0" class="specs-wrapper">
              <el-tag
                v-for="grp in row.options"
                :key="grp.id"
                size="small"
                type="info"
                class="spec-tag"
              >
                {{ grp.title }} ({{ grp.options.length }}項)
              </el-tag>
            </div>
            <span v-else class="text-muted">無客製規格</span>
          </template>
        </el-table-column>

        <el-table-column label="上架/估清" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.isAvailable"
              active-text="上架"
              inactive-text="估清"
              inline-prompt
              @change="handleToggleAvailability(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEditItemDialog(row)">編輯</el-button>
            <el-popconfirm title="確定要刪除此餐點嗎？" @confirm="handleDeleteItem(Number(row.id))">
              <template #reference>
                <el-button type="danger" link size="small">刪除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Create / Edit Menu Item Dialog -->
    <el-dialog
      v-model="itemDialogVisible"
      :title="isEditMode ? '編輯餐點' : '新增餐點'"
      width="680px"
      destroy-on-close
    >
      <el-form :model="itemForm" label-width="100px">
        <el-form-item label="所屬分類" required>
          <el-select v-model="itemForm.categoryId" placeholder="請選擇分類" style="width: 100%">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="餐點品名" required>
          <el-input v-model="itemForm.name" placeholder="例如：日式黑咖哩牛腩飯" />
        </el-form-item>

        <el-form-item label="餐點單價" required>
          <el-input-number v-model="itemForm.price" :min="0" :step="10" style="width: 180px" />
        </el-form-item>

        <el-form-item label="餐點介紹">
          <el-input
            v-model="itemForm.description"
            type="textarea"
            rows="2"
            placeholder="介紹餐點特色、風味或食材"
          />
        </el-form-item>

        <el-form-item label="餐點圖片">
          <div class="upload-section">
            <el-upload
              class="dish-uploader"
              action="/api/upload"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <img v-if="itemForm.imageUrl" :src="itemForm.imageUrl" class="uploaded-avatar" />
              <el-icon v-else class="uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip-col">
              <el-input
                v-model="itemForm.imageUrl"
                placeholder="或直接貼上圖片網址 (URL)"
                size="small"
                style="margin-bottom: 8px"
              />
              <span class="upload-hint">支援 JPG、PNG、WEBP，檔案小於 5MB</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="排序權重">
          <el-input-number v-model="itemForm.sortOrder" :min="0" style="width: 120px" />
          <span class="text-muted" style="margin-left: 10px">數字愈小愈靠前</span>
        </el-form-item>

        <!-- Customization Specification Groups -->
        <el-divider content-position="left">客製化規格選項 (如辣度、加料)</el-divider>

        <div class="option-groups-container">
          <div v-for="(grp, gIdx) in itemForm.options" :key="gIdx" class="option-group-card">
            <div class="group-header">
              <el-input v-model="grp.title" placeholder="群組名稱 (例：辣度選擇)" style="width: 180px" />
              <el-select v-model="grp.type" style="width: 100px">
                <el-option label="單選" value="SINGLE" />
                <el-option label="多選" value="MULTIPLE" />
              </el-select>
              <el-checkbox v-model="grp.isRequired" label="必選" />
              <el-button type="danger" link @click="removeOptionGroup(gIdx)">刪除規格群組</el-button>
            </div>

            <div class="group-items">
              <div v-for="(opt, oIdx) in grp.options" :key="oIdx" class="opt-row">
                <el-input v-model="opt.name" placeholder="選項名稱 (例: 大辣 / 加蛋)" style="width: 180px" />
                <el-input-number
                  v-model="opt.extraPrice"
                  :min="0"
                  :step="5"
                  placeholder="加價金額"
                  style="width: 130px"
                />
                <span class="currency-hint">NT$</span>
                <el-button type="danger" text @click="removeOptionItem(grp, oIdx)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
              <el-button type="primary" link size="small" @click="addOptionItem(grp)">
                <el-icon><Plus /></el-icon> 新增細項選項
              </el-button>
            </div>
          </div>

          <el-button type="primary" plain @click="addOptionGroup" style="width: 100%">
            <el-icon><Plus /></el-icon> 新增規格群組
          </el-button>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="itemDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="savingItem" @click="handleSaveItem">儲存餐點</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Category Management Dialog -->
    <el-dialog v-model="categoryDialogVisible" title="菜單分類管理" width="500px">
      <div class="cat-create-row">
        <el-input v-model="newCategoryName" placeholder="輸入新分類名稱" style="flex: 1" />
        <el-button type="primary" @click="handleCreateCategory">新增</el-button>
      </div>

      <el-table :data="categories" style="width: 100%; margin-top: 16px" border size="small">
        <el-table-column prop="name" label="分類名稱" />
        <el-table-column prop="_count.items" label="餐點數" width="90" align="center" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-popconfirm title="確定要刪除此分類？" @confirm="handleDeleteCategory(Number(row.id))">
              <template #reference>
                <el-button type="danger" link size="small">刪除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, FolderAdd, Delete } from '@element-plus/icons-vue';
import api from '../api';

const defaultDishImage =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60';

const categories = ref<any[]>([]);
const menuItems = ref<any[]>([]);
const loading = ref(false);
const selectedCategory = ref<number | null>(null);
const searchQuery = ref('');

// Item Dialog
const itemDialogVisible = ref(false);
const isEditMode = ref(false);
const savingItem = ref(false);
const currentEditingId = ref<number | null>(null);

const itemForm = reactive<any>({
  categoryId: undefined,
  name: '',
  description: '',
  price: 100,
  imageUrl: '',
  sortOrder: 0,
  options: [],
});

// Category Dialog
const categoryDialogVisible = ref(false);
const newCategoryName = ref('');

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('admin_token');
  return {
    Authorization: `Bearer ${token}`,
  };
});

const filteredItems = computed(() => {
  return menuItems.value.filter((item) => {
    if (selectedCategory.value && item.categoryId !== selectedCategory.value) {
      return false;
    }
    if (searchQuery.value) {
      return item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    }
    return true;
  });
});

const fetchCategories = async () => {
  try {
    const res: any = await api.get('/categories');
    if (res.success) {
      categories.value = res.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchMenuItems = async () => {
  loading.value = true;
  try {
    const res: any = await api.get('/menu-items');
    if (res.success) {
      menuItems.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleToggleAvailability = async (item: any) => {
  try {
    const res: any = await api.patch(`/menu-items/${item.id}/availability`);
    if (res.success) {
      ElMessage.success(`[${item.name}] 狀態已更新為: ${item.isAvailable ? '上架中' : '已估清'}`);
    }
  } catch (error) {
    item.isAvailable = !item.isAvailable; // revert on fail
  }
};

const handleDeleteItem = async (id: number) => {
  try {
    const res: any = await api.delete(`/menu-items/${id}`);
    if (res.success) {
      ElMessage.success('餐點已刪除');
      fetchMenuItems();
    }
  } catch (error) {
    console.error(error);
  }
};

const openCreateItemDialog = () => {
  isEditMode.value = false;
  currentEditingId.value = null;
  itemForm.categoryId = categories.value[0]?.id || undefined;
  itemForm.name = '';
  itemForm.description = '';
  itemForm.price = 120;
  itemForm.imageUrl = '';
  itemForm.sortOrder = 0;
  itemForm.options = [];
  itemDialogVisible.value = true;
};

const openEditItemDialog = (row: any) => {
  isEditMode.value = true;
  currentEditingId.value = row.id;
  itemForm.categoryId = row.categoryId;
  itemForm.name = row.name;
  itemForm.description = row.description || '';
  itemForm.price = row.price;
  itemForm.imageUrl = row.imageUrl || '';
  itemForm.sortOrder = row.sortOrder || 0;
  itemForm.options = (row.options || []).map((grp: any) => ({
    title: grp.title,
    type: grp.type,
    isRequired: grp.isRequired,
    options: (grp.options || []).map((opt: any) => ({
      name: opt.name,
      extraPrice: opt.extraPrice,
    })),
  }));
  itemDialogVisible.value = true;
};

const addOptionGroup = () => {
  itemForm.options.push({
    title: '客製規格',
    type: 'SINGLE',
    isRequired: false,
    options: [{ name: '選項1', extraPrice: 0 }],
  });
};

const removeOptionGroup = (index: number | string) => {
  itemForm.options.splice(Number(index), 1);
};

const addOptionItem = (grp: any) => {
  grp.options.push({ name: '', extraPrice: 0 });
};

const removeOptionItem = (grp: any, index: number | string) => {
  grp.options.splice(Number(index), 1);
};

const handleUploadSuccess = (response: any) => {
  if (response.success && response.data?.url) {
    itemForm.imageUrl = response.data.url;
    ElMessage.success('圖片上傳成功');
  }
};

const beforeUpload = (file: File) => {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error('圖片大小不可超過 5MB');
  }
  return isLt5M;
};

const handleSaveItem = async () => {
  if (!itemForm.name || !itemForm.categoryId) {
    ElMessage.warning('請填寫餐點品名與分類');
    return;
  }

  savingItem.value = true;
  try {
    if (isEditMode.value && currentEditingId.value) {
      await api.put(`/menu-items/${currentEditingId.value}`, itemForm);
      ElMessage.success('餐點更新成功');
    } else {
      await api.post('/menu-items', itemForm);
      ElMessage.success('餐點新增成功');
    }
    itemDialogVisible.value = false;
    fetchMenuItems();
  } catch (error: any) {
    console.error(error);
  } finally {
    savingItem.value = false;
  }
};

// Category management methods
const openCategoryDialog = () => {
  newCategoryName.value = '';
  categoryDialogVisible.value = true;
};

const handleCreateCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  try {
    await api.post('/categories', { name: newCategoryName.value.trim() });
    ElMessage.success('分類已建立');
    newCategoryName.value = '';
    fetchCategories();
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteCategory = async (id: number) => {
  try {
    await api.delete(`/categories/${id}`);
    ElMessage.success('分類已刪除');
    fetchCategories();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchCategories();
  fetchMenuItems();
});
</script>

<style scoped>
.menu-page {
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

.header-left,
.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.table-card {
  border-radius: 12px;
  border: none;
}

.dish-img-thumb {
  width: 54px;
  height: 54px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dish-name-cell {
  display: flex;
  flex-direction: column;
}

.name-text {
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
}

.desc-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.price-text {
  font-weight: 700;
  color: #0284c7;
}

.specs-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.spec-tag {
  border-radius: 4px;
}

.text-muted {
  font-size: 12px;
  color: #94a3b8;
}

/* Dish uploader styles */
.upload-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

.dish-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  background-color: #f8fafc;
}

.uploaded-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploader-icon {
  font-size: 28px;
  color: #94a3b8;
}

.upload-tip-col {
  flex: 1;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

/* Option groups styling */
.option-groups-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f8fafc;
  padding: 14px;
  border-radius: 8px;
}

.option-group-card {
  background: #ffffff;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.group-items {
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opt-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency-hint {
  font-size: 13px;
  color: #64748b;
}

.cat-create-row {
  display: flex;
  gap: 10px;
}
</style>
