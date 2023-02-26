import {
  SPACING_NONE,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXXSMALL,
} from 'styles';

export type ListPadding = 'none' | 'small' | 'medium' | 'large';

export const listPaddingMap = {
  none: SPACING_NONE,
  small: SPACING_XXXSMALL,
  medium: SPACING_XSMALL,
  large: SPACING_SMALL,
};
