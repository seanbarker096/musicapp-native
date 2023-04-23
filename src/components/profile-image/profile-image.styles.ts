import { ProfileImageSize } from './profile-image.types';

export function profileImageSizeGenerator(size: ProfileImageSize): number {
  switch (size) {
    case 'large':
      return 60;
    case 'medium':
      return 48;
    default: // default is 'small'
      return 30;
    case 'xsmall':
      return 20;
  }
}
