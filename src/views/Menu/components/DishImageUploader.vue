<template>
  <div class="flex items-start gap-4">
    <div
      v-if="modelValue"
      class="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200 group bg-slate-50"
    >
      <img :src="modelValue" class="w-full h-full object-cover" alt="Dish Preview" />
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <el-button type="danger" circle size="small" @click="removeImage">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onInputChange"
        />
        <el-button
          type="primary"
          plain
          :loading="uploading"
          @click="fileInputRef?.click()"
        >
          <el-icon class="mr-1"><UploadFilled /></el-icon>
          {{ modelValue ? $t('menu.replaceImage') : $t('menu.uploadImage') }}
        </el-button>
        <el-button v-if="modelValue" type="danger" plain @click="removeImage">
          {{ $t('common.delete') }}
        </el-button>
      </div>
      <span class="text-xs text-slate-400">{{ $t('menu.uploadHint') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadFilled, Delete } from '@element-plus/icons-vue';
import { useImageUpload } from '../../../composables/menu/useImageUpload';

defineProps<{ modelValue?: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', val: string): void }>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const { uploading, handleFileSelect, removeImage } = useImageUpload(emit);

const onInputChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    await handleFileSelect(file);
    target.value = '';
  }
};
</script>
