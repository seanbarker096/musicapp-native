import * as React from 'react';
import { FC } from 'react';
import Svg, { Path } from 'react-native-svg';
import { SVGProps } from './SVGComponents.types';

export const SearchOutlineSVG: FC<SVGProps> = (props: SVGProps) => (
  <Svg
    width={20}
    height={22}
    fill={props.fill ?? 'inherit'}
  >
    <Path d="m20.73 19.31-3.71-3.68a9 9 0 1 0-1.39 1.39l3.68 3.68a1.002 1.002 0 0 0 1.42 0 1 1 0 0 0 0-1.39Zm-10.71-2.29a7 7 0 1 1 0-13.999 7 7 0 0 1 0 14Z" />
  </Svg>
);
