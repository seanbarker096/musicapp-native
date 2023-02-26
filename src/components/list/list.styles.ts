import {
  SPACING_NONE,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXSMALL,
} from 'styles';

export type ListPadding = 'none' | 'small' | 'medium' | 'large';

export const listPaddingMap = {
  none: SPACING_NONE,
  small: SPACING_XXSMALL,
  medium: SPACING_XSMALL,
  large: SPACING_SMALL,
};
