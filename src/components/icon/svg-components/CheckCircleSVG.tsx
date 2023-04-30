import * as React from 'react';
import { FC } from 'react';
import { Path } from 'react-native-svg';
import { SVGProps } from '../icon.types';

export const CheckCircleSVG: FC<SVGProps> = () => (
  <>
    <Path d="M11 0C4.95 0 0 4.95 0 11s4.95 11 11 11 11-4.95 11-11S17.05 0 11 0Zm4.62 9.13-5.28 5.28c-.44.44-1.1.44-1.54 0l-2.42-2.42c-.44-.44-.44-1.1 0-1.54.44-.44 1.1-.44 1.54 0l1.65 1.65 4.51-4.51c.44-.44 1.1-.44 1.54 0 .44.44.44 1.1 0 1.54Z" />
  </>
);
