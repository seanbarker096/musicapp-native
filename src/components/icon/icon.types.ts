import { SvgProps } from 'react-native-svg';

export enum IconColor {
  DARK = 'dark',
  MID = 'mid',
  LIGHT = 'light',
  SECONDARY = 'secondary',
  PRIMARY = 'primary',
}

export interface SVGProps extends SvgProps {
  opacity?: number;
}
