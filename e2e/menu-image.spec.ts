import { test, expect } from '@playwright/test';
import {
  validateImageFile,
  compressImageIfNeeded,
  ALLOWED_IMAGE_TYPES,
  COMPRESSION_THRESHOLD,
  MAX_FILE_SIZE_LIMIT,
} from '../src/utils/imageCompressor';

test.describe('餐點圖片規格驗證與壓縮邏輯測試', () => {
  test('負向測試：不支援的檔案格式應被阻擋並返回錯誤 Key', () => {
    const textFile = new File(['hello text'], 'test.txt', { type: 'text/plain' });
    const pdfFile = new File(['pdf dummy'], 'doc.pdf', { type: 'application/pdf' });
    const exeFile = new File(['binary'], 'app.exe', { type: 'application/x-msdownload' });

    const textRes = validateImageFile(textFile);
    expect(textRes.valid).toBe(false);
    expect(textRes.errorKey).toBe('menu.invalidImageType');

    const pdfRes = validateImageFile(pdfFile);
    expect(pdfRes.valid).toBe(false);
    expect(pdfRes.errorKey).toBe('menu.invalidImageType');

    const exeRes = validateImageFile(exeFile);
    expect(exeRes.valid).toBe(false);
    expect(exeRes.errorKey).toBe('menu.invalidImageType');
  });

  test('負向測試：超過 10MB 的檔案應被阻擋', () => {
    const hugeBuffer = new Uint8Array(MAX_FILE_SIZE_LIMIT + 1024);
    const hugeFile = new File([hugeBuffer], 'huge.jpg', { type: 'image/jpeg' });

    const result = validateImageFile(hugeFile);
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe('menu.fileTooLarge');
  });

  test('正向測試：支援的合法圖片格式（JPG, PNG, WEBP）應通過校驗', () => {
    ALLOWED_IMAGE_TYPES.forEach((mime) => {
      const file = new File(['dummy content'], `sample.${mime.split('/')[1]}`, { type: mime });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
      expect(result.errorKey).toBeUndefined();
    });
  });

  test('正向測試：小於等於 1MB 的圖片不應被強制重壓縮', async () => {
    const smallBuffer = new Uint8Array(500 * 1024);
    const smallFile = new File([smallBuffer], 'small.jpg', { type: 'image/jpeg' });

    const { file, compressed, originalSize, finalSize } = await compressImageIfNeeded(smallFile);
    expect(compressed).toBe(false);
    expect(finalSize).toBe(originalSize);
    expect(file.name).toBe('small.jpg');
  });

  test('正向測試：大於 1MB 的圖片應觸發非同步壓縮前置與輸出檢驗', async () => {
    const largeBuffer = new Uint8Array(2 * 1024 * 1024);
    const largeFile = new File([largeBuffer], 'large.png', { type: 'image/png' });

    expect(largeFile.size).toBeGreaterThan(COMPRESSION_THRESHOLD);
    const res = await compressImageIfNeeded(largeFile);
    expect(res.originalSize).toBe(2 * 1024 * 1024);
    expect(res.file).toBeInstanceOf(File);
    expect(res.file.name).toBe('large.png');
    expect(res.file.type).toBe('image/png');
  });
});
