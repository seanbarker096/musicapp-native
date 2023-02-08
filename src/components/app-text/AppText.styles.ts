import {
  TEXT_SIZE_H4,
  TEXT_SIZE_REGULAR,
  TEXT_SIZE_SMALL,
  TEXT_SIZE_XSMALL,
} from 'styles/typography.styles';
import { TextSize, TextWeight } from './AppText.types';

export const textSizeMap: { [key in TextSize]: number } = {
  large: TEXT_SIZE_H4,
  regular: TEXT_SIZE_REGULAR,
  small: TEXT_SIZE_SMALL,
  xsmall: TEXT_SIZE_XSMALL,
};

export const textWeightMap: { [key in TextWeight]: 'normal' | 'bold' | '100' } =
  {
    normal: 'normal',
    bold: 'bold',
    light: '100',
  };
