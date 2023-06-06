import { ProfileImageSize } from './profile-image.types';

export function profileImageSizeGenerator(size: ProfileImageSize): number {
  switch (size) {
    case 'xlarge':
      return 80;
    case 'large':
      return 60;
    case 'medium':
      return 48;
    case 'xsmall':
      return 20;
    default: // default is 'small'
      return 30;
  }
}
