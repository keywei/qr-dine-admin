import { ref, onMounted, onUnmounted } from 'vue';
import { ElNotification } from 'element-plus';
import { serviceBellApi, type ServiceCall } from '../../api/serviceBell';
import { getAdminSocket } from '../../socket';
import i18n from '../../locales';

export const useServiceBellAdmin = () => {
  const activeCalls = ref<ServiceCall[]>([]);
  const loading = ref(false);

  const fetchCalls = async () => {
    try {
      loading.value = true;
      const res = await serviceBellApi.getActiveCalls();
      activeCalls.value = res || [];
    } catch (err) {
      console.error('[ServiceBell Error]:', err);
    } finally {
      loading.value = false;
    }
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  const onCalled = (call: ServiceCall) => {
    playChime();
    const typeLabel = i18n.global.te(`serviceBell.types.${call.type}`)
      ? i18n.global.t(`serviceBell.types.${call.type}`)
      : call.type;
    ElNotification({
      title: i18n.global.t('serviceBell.notificationTitle', { table: call.table?.code || '' }),
      message: `${typeLabel}${call.note ? `（${call.note}）` : ''}`,
      type: 'warning',
      duration: 5000,
    });
    fetchCalls();
  };

  const onCompleted = () => {
    fetchCalls();
  };

  const complete = async (id: number) => {
    await serviceBellApi.completeCall(id);
    await fetchCalls();
  };

  onMounted(() => {
    fetchCalls();
    const s = getAdminSocket();
    s.on('service_bell:called', onCalled);
    s.on('service_bell:completed', onCompleted);
  });

  onUnmounted(() => {
    const s = getAdminSocket();
    s.off('service_bell:called', onCalled);
    s.off('service_bell:completed', onCompleted);
  });

  return { activeCalls, loading, fetchCalls, complete };
};
