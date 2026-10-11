import { createSocialImage, socialImageSize } from '@/lib/social-image';

export const alt = 'Kino XII — discover movies and book cinema tickets';
export const size = socialImageSize;
export const contentType = 'image/png';

export default function TwitterImage() {
  return createSocialImage();
}
