import { ref, onMounted } from 'vue';
import api from '../../api';
import type { DiningTable, TableQR, BatchQRsResponse } from '../../types/table';

export const useTableQuery = () => {
  const tables = ref<DiningTable[]>([]);
  const tablesWithQR = ref<TableQR[]>([]);
  const takeoutQR = ref<BatchQRsResponse['takeout'] | null>(null);
  const loading = ref(false);

  const fetchTables = async () => {
    loading.value = true;
    try {
      const [batch, list] = await Promise.all([
        api.get<BatchQRsResponse>('/tables/batch/qrcodes'),
        api.get<DiningTable[]>('/tables'),
      ]);
      tablesWithQR.value = batch?.tables || [];
      takeoutQR.value = batch?.takeout || null;
      tables.value = list || [];
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchTables);

  return { tables, tablesWithQR, takeoutQR, loading, fetchTables };
};
