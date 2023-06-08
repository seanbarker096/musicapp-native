import {
  SPACING_NONE,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXSMALL,
  SPACING_XXXSMALL,
} from 'styles';

// THis ensures consitent paddings for lists, avoiding allowing passing in any padding value you want
export type ListPadding = 'none' | 'xxxsmall' | 'xxsmall' | 'xsmall' | 'small';

export const listPaddingMap = {
  none: SPACING_NONE,
  xxxsmall: SPACING_XXXSMALL,
  xxsmall: SPACING_XXSMALL,
  xsmall: SPACING_XSMALL,
  small: SPACING_SMALL,
};
