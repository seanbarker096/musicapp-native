import {
  COLOR_NEUTRAL_XXXXLIGHT,
  COLOR_PRIMARY_DARK,
  COLOR_SECONDARY,
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
      return COLOR_SECONDARY;
    case IconColor.PRIMARY:
      return COLOR_PRIMARY_DARK;
    case IconColor.WHITE:
      return COLOR_NEUTRAL_XXXXLIGHT;
    default:
      throw Error('Icon color not defined');
  }
}
