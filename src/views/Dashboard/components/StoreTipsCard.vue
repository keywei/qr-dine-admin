<template>
  <el-card shadow="never" class="!rounded-xl !border-none">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-base font-bold text-slate-800">{{ $t('dashboard.tipsTitle') }}</span>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex gap-3 items-start p-2.5 rounded-lg bg-slate-50">
        <span class="text-xl">✅</span>
        <div class="text-sm text-slate-700 leading-normal">
          <b>{{ $t('dashboard.tip1Title') }}</b>
          {{ $t('dashboard.tip1Desc') }}
        </div>
      </div>

      <div class="flex gap-3 items-start p-2.5 rounded-lg bg-slate-50">
        <span class="text-xl">📱</span>
        <div class="text-sm text-slate-700 leading-normal">
          <b>{{ $t('dashboard.tip2Title') }}</b>
          {{ $t('dashboard.tip2Desc') }}
        </div>
      </div>

      <div class="flex gap-3 items-start p-2.5 rounded-lg bg-slate-50">
        <span class="text-xl">🔊</span>
        <div class="text-sm text-slate-700 leading-normal">
          <b>{{ $t('dashboard.tip3Title') }}</b>
          {{ $t('dashboard.tip3Desc') }}
        </div>
      </div>
    </div>
  </el-card>
</template>
