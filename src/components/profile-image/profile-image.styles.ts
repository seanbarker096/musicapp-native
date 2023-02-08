import { ProfileImageSize } from './profile-image.types';

export function profileImageSizeGenerator(size: ProfileImageSize): number {
  switch (size) {
    case 'large':
      return 60;
    case 'medium':
      return 48;
    default:
      return 30;
  }
}
