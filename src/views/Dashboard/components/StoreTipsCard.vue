<template>
  <el-card shadow="never" class="dash-card">
    <template #header>
      <div class="card-head">
        <span class="head-title">{{ $t('dashboard.tipsTitle') }}</span>
      </div>
    </template>

    <div class="tips-content">
      <div class="tip-row">
        <span class="tip-icon">✅</span>
        <div class="tip-desc">
          <b>{{ $t('dashboard.tip1Title') }}</b>
          {{ $t('dashboard.tip1Desc') }}
        </div>
      </div>

      <div class="tip-row">
        <span class="tip-icon">📱</span>
        <div class="tip-desc">
          <b>{{ $t('dashboard.tip2Title') }}</b>
          {{ $t('dashboard.tip2Desc') }}
        </div>
      </div>

      <div class="tip-row">
        <span class="tip-icon">🔊</span>
        <div class="tip-desc">
          <b>{{ $t('dashboard.tip3Title') }}</b>
          {{ $t('dashboard.tip3Desc') }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.dash-card { border-radius: 12px; border: none; }
.card-head { display: flex; justify-content: space-between; align-items: center; }
.head-title { font-size: 16px; font-weight: 700; color: #1e293b; }
.tips-content { display: flex; flex-direction: column; gap: 16px; }
.tip-row { display: flex; gap: 12px; align-items: flex-start; padding: 10px; border-radius: 8px; background-color: #f8fafc; }
.tip-icon { font-size: 20px; }
.tip-desc { font-size: 14px; color: #334155; line-height: 1.5; }
</style>
