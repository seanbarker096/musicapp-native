import * as React from 'react';
import { Path } from 'react-native-svg';
import { SVGProps } from '../icon.types';

export const PlayButtonSVG: React.FC<SVGProps> = ({ opacity = 1 }) => (
  <Path
    d="M20.864 13.29a2.876 2.876 0 0 0 0-4.58A54.82 54.82 0 0 0 5.716.53L4.72.18C2.813-.49.8.786.54 2.732a63.457 63.457 0 0 0 0 16.536c.26 1.946 2.273 3.222 4.18 2.552l.996-.35a54.819 54.819 0 0 0 15.148-8.18Z"
    fillOpacity={opacity}
  />
);
