import {
  COLOR_SECONDARY_XXDARK,
  ICON_COLOR_DARK,
  ICON_COLOR_LIGHT,
  ICON_COLOR_MID,
} from 'styles';
import { IconColor } from './icon.types';

export function iconColorGenerator(color: IconColor): string {
  switch (color) {
    case IconColor.DARK:
      return ICON_COLOR_DARK;
    case IconColor.MID:
      return ICON_COLOR_MID;
    case IconColor.LIGHT:
      return ICON_COLOR_LIGHT;
    case IconColor.SECONDARY:
      return COLOR_SECONDARY_XXDARK;
    default:
      throw Error('Icon color not defined');
  }
}
