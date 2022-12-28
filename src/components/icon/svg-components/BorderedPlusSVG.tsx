import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { iconColorGenerator } from '../icon-utils';
import { IconColor, SVGProps } from '../icon.types';

export const BorderedPlusSVG = ({ color = IconColor.DARK }: SVGProps) => (
  <Svg
    width={22}
    height={23}
    fill={iconColorGenerator(color)}
  >
    <Path d="M5.11 11.016c0-.489.396-.885.885-.885h4.12v-4.12a.885.885 0 1 1 1.77 0v4.12h4.12a.885.885 0 1 1 0 1.77h-4.12v4.12a.885.885 0 1 1-1.77 0v-4.12h-4.12a.885.885 0 0 1-.885-.885Z" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.475 1.305a50.142 50.142 0 0 1 11.05 0c2.155.241 3.895 1.938 4.148 4.106a48.256 48.256 0 0 1 0 11.21c-.253 2.168-1.993 3.865-4.148 4.106a50.143 50.143 0 0 1-11.05 0c-2.155-.24-3.895-1.938-4.148-4.105a48.255 48.255 0 0 1 0-11.211C1.58 3.243 3.32 1.546 5.475 1.305Zm10.854 1.759a48.373 48.373 0 0 0-10.658 0c-1.35.15-2.43 1.217-2.587 2.552a46.485 46.485 0 0 0 0 10.8c.157 1.336 1.237 2.401 2.587 2.552 3.512.393 7.146.393 10.658 0 1.35-.15 2.43-1.216 2.587-2.552.42-3.588.42-7.212 0-10.8-.157-1.335-1.237-2.401-2.587-2.552Z"
    />
  </Svg>
);
