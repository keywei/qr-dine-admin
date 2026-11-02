<template>
  <el-card shadow="never" class="!rounded-xl !border-slate-200">
    <el-table v-loading="loading" :data="tickets" style="width: 100%">
      <el-table-column :label="$t('queue.colTicketNo')" width="100">
        <template #default="{ row }">
          <span class="text-base font-extrabold text-blue-600">#{{ row.ticketNo }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('queue.colPhone')" width="140">
        <template #default="{ row }">{{ maskPhoneNumber(row.customerPhone) }}</template>
      </el-table-column>

      <el-table-column :label="$t('queue.colPartySize')" width="110">
        <template #default="{ row }">{{ $t('queue.partySizeText', { count: row.partySize }) }}</template>
      </el-table-column>

      <el-table-column :label="$t('queue.colWaitTime')" width="120">
        <template #default="{ row }">
          <span class="text-xs text-slate-500">{{ formatWaitTime(row.createdAt) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('queue.colStatus')" width="110">
        <template #default="{ row }">
          <el-tag size="small" :type="getStatusTag(row.status).type">
            {{ $t(getStatusTag(row.status).labelKey) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('queue.colCallCount')" width="150">
        <template #default="{ row }">
          <el-tag size="small" :type="getCallCountStatus(row.callCount).type" effect="plain">
            {{ $t(getCallCountStatus(row.callCount).labelKey) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.actions')" min-width="230" align="right">
        <template #default="{ row }">
          <div v-if="row.status === 'WAITING' || row.status === 'CALLING'" class="flex justify-end gap-1.5">
            <el-button type="primary" size="small" :loading="operatingId === row.id" @click="$emit('call', row)">
              {{ $t('queue.btnCall') }}
            </el-button>
            <el-button type="success" size="small" :loading="operatingId === row.id" @click="$emit('seat', row)">
              {{ $t('queue.btnSeat') }}
            </el-button>
            <el-popconfirm :title="$t('queue.cancelConfirm')" @confirm="$emit('cancel', row)">
              <template #reference>
                <el-button type="danger" text size="small" :loading="operatingId === row.id">
                  {{ $t('queue.btnCancel') }}
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <span v-else class="text-xs text-slate-400">{{ $t('queue.noActionNeeded') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { maskPhoneNumber, formatWaitTime, getCallCountStatus, QUEUE_STATUS_TAG_MAP } from '../../../utils/queueHelper';
import type { QueueTicket, QueueStatus } from '../../../types/queue';

defineProps<{ tickets: QueueTicket[]; loading: boolean; operatingId: number | null }>();
defineEmits<{ (e: 'call', ticket: QueueTicket): void; (e: 'seat', ticket: QueueTicket): void; (e: 'cancel', ticket: QueueTicket): void }>();

const getStatusTag = (status: QueueStatus) => {
  return QUEUE_STATUS_TAG_MAP[status] || { labelKey: 'queue.statusWaiting', type: 'info' as const };
};
</script>
