import * as React from 'react';
import { FC } from 'react';
import { Path } from 'react-native-svg';
import { SVGProps } from '../icon.types';

export const LeftArrowSVG: FC<SVGProps> = () => (
  <>
    <Path
      d="M18.5 9.5H7.11l4.952-4.931A1.504 1.504 0 0 0 10.996 2c-.4 0-.783.159-1.065.44L2.428 9.936c-.137.142-.244.31-.315.494-.15.365-.15.774 0 1.14.071.183.178.351.315.494l7.503 7.494a1.501 1.501 0 0 0 2.13 0 1.499 1.499 0 0 0 0-2.129l-4.951-4.93H18.5a1.501 1.501 0 0 0 1.5-1.5A1.498 1.498 0 0 0 18.5 9.5Z"
    />
  </>
);
