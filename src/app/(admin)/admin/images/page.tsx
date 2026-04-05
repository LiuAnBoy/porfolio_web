import type { Metadata } from 'next';

import { ImageTable } from '@/modules/admin/images/components/ImageTable';

export const metadata: Metadata = {
  title: '圖片管理',
  robots: 'noindex, nofollow',
};

/**
 * Admin image management page.
 */
export default function ImagesPage() {
  return <ImageTable />;
}
