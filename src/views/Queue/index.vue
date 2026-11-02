<template>
  <div class="flex flex-col gap-4">
    <QueueStatsCards
      :stats="stats"
      @call-next="handleCallNext"
    />

    <QueueFilterBar
      v-model:active-tab="activeTab"
      v-model:search-query="searchQuery"
      :loading="loading"
      @refresh="fetchData"
    />

    <QueueTable
      :tickets="filteredTickets"
      :loading="loading"
      :operating-id="operatingId"
      @call="callTicket"
      @seat="seatTicket"
      @cancel="cancelTicket"
    />
  </div>
</template>

<script setup lang="ts">
import QueueStatsCards from './components/QueueStatsCards.vue';
import QueueFilterBar from './components/QueueFilterBar.vue';
import QueueTable from './components/QueueTable.vue';
import { useQueueQuery } from '../../composables/queue/useQueueQuery';
import { useQueueAction } from '../../composables/queue/useQueueAction';

const { tickets, loading, activeTab, searchQuery, stats, filteredTickets, fetchData } = useQueueQuery();
const { operatingId, callTicket, seatTicket, cancelTicket, callNext } = useQueueAction(fetchData);

const handleCallNext = () => {
  const nextWaiting = tickets.value.find((t) => t.status === 'WAITING');
  callNext(nextWaiting);
};
</script>
