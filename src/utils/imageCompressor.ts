import imageCompression from 'browser-image-compression';

export interface CompressionResult {
  file: File;
  compressed: boolean;
  originalSize: number;
  finalSize: number;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
export const COMPRESSION_THRESHOLD = 1 * 1024 * 1024; // 1MB

export const validateImageFile = (file: File): { valid: boolean; errorKey?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, errorKey: 'menu.invalidImageType' };
  }
  if (file.size > MAX_FILE_SIZE_LIMIT) {
    return { valid: false, errorKey: 'menu.fileTooLarge' };
  }
  return { valid: true };
};

export const compressImageIfNeeded = async (file: File): Promise<CompressionResult> => {
  const originalSize = file.size;
  if (file.size <= COMPRESSION_THRESHOLD) {
    return { file, compressed: false, originalSize, finalSize: originalSize };
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const compressedFile = new File([compressedBlob], file.name, { type: file.type });
    return {
      file: compressedFile,
      compressed: true,
      originalSize,
      finalSize: compressedFile.size,
    };
  } catch {
    // 備援：若 Node/Worker 環境不支援 canvas 則返回原檔案
    return { file, compressed: false, originalSize, finalSize: originalSize };
  }
};
