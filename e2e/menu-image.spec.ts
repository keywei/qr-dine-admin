import { test, expect } from '@playwright/test';
import {
  validateImageFile,
  compressImageIfNeeded,
  ALLOWED_IMAGE_TYPES,
  COMPRESSION_THRESHOLD,
  MAX_FILE_SIZE_LIMIT,
} from '../src/utils/imageCompressor';
import { createMockFile } from './fixtures/factories';

test.describe('餐點圖片規格驗證與壓縮邏輯測試', () => {
  test('負向測試：不支援的檔案格式應被阻擋並返回錯誤 Key', () => {
    // Arrange: 準備非圖片類型檔案
    const files = [
      createMockFile('test.txt', 100, 'text/plain'),
      createMockFile('doc.pdf', 200, 'application/pdf'),
      createMockFile('app.exe', 500, 'application/x-msdownload'),
    ];

    // Act & Assert
    files.forEach((file) => {
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe('menu.invalidImageType');
    });
  });

  test('負向測試：超過 10MB 的檔案應被阻擋', () => {
    // Arrange: 超過 10MB 檔案
    const hugeFile = createMockFile('huge.jpg', MAX_FILE_SIZE_LIMIT + 1024, 'image/jpeg');

    // Act & Assert
    const result = validateImageFile(hugeFile);
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe('menu.fileTooLarge');
  });

  test('正向測試：支援的合法圖片格式（JPG, PNG, WEBP）應通過校驗', () => {
    ALLOWED_IMAGE_TYPES.forEach((mime) => {
      const file = createMockFile(`sample.${mime.split('/')[1]}`, 500, mime);
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
      expect(result.errorKey).toBeUndefined();
    });
  });

  test('正向測試：小於等於 1MB 的圖片不應被強制重壓縮', async () => {
    // Arrange: 500KB 圖片
    const smallFile = createMockFile('small.jpg', 500 * 1024, 'image/jpeg');

    // Act
    const { file, compressed, originalSize, finalSize } = await compressImageIfNeeded(smallFile);

    // Assert
    expect(compressed).toBe(false);
    expect(finalSize).toBe(originalSize);
    expect(file.name).toBe('small.jpg');
  });

  test('正向測試：大於 1MB 的圖片應觸發非同步壓縮前置與輸出檢驗', async () => {
    // Arrange: 2MB PNG 圖片
    const largeFile = createMockFile('large.png', 2 * 1024 * 1024, 'image/png');
    expect(largeFile.size).toBeGreaterThan(COMPRESSION_THRESHOLD);

    // Act
    const res = await compressImageIfNeeded(largeFile);

    // Assert
    expect(res.originalSize).toBe(2 * 1024 * 1024);
    expect(res.file).toBeInstanceOf(File);
    expect(res.file.name).toBe('large.png');
    expect(res.file.type).toBe('image/png');
  });
});
