import {
  SPACING_NONE,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXXSMALL,
} from 'styles';

export type ListPadding = 'none' | 'xxxsmall' | 'xsmall' | 'small';

export const listPaddingMap = {
  none: SPACING_NONE,
  xxxsmall: SPACING_XXXSMALL,
  xsmall: SPACING_XSMALL,
  small: SPACING_SMALL,
};
