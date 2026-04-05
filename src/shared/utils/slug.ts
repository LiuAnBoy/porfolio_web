import { pinyin } from 'pinyin-pro';

/**
 * Check if string contains Chinese characters
 */
function containsChinese(str: string): boolean {
  return /[\u4e00-\u9fa5]/.test(str);
}

/**
 * Generate slug from label
 * - Chinese: convert to pinyin with hyphens
 * - English: lowercase + special chars to hyphens
 */
export function generateSlug(label: string): string {
  if (containsChinese(label)) {
    return pinyin(label, {
      toneType: 'none',
      type: 'array',
    })
      .join('-')
      .toLowerCase();
  }
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
