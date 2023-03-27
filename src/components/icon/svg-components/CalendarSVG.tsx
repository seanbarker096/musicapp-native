import * as React from 'react';
import { FC } from 'react';
import { Path } from 'react-native-svg';
import { SVGProps } from '../icon.types';

export const CalendarSVG: FC<SVGProps> = () => (
  <Path d="M18.7 2.2h-2.2V1.1a1.1 1.1 0 0 0-2.2 0v1.1H7.7V1.1a1.1 1.1 0 1 0-2.2 0v1.1H3.3A3.3 3.3 0 0 0 0 5.5v13.2A3.3 3.3 0 0 0 3.3 22h15.4a3.3 3.3 0 0 0 3.3-3.3V5.5a3.3 3.3 0 0 0-3.3-3.3Zm1.1 16.5a1.1 1.1 0 0 1-1.1 1.1H3.3a1.1 1.1 0 0 1-1.1-1.1V11h17.6v7.7Zm0-9.9H2.2V5.5a1.1 1.1 0 0 1 1.1-1.1h2.2v1.1a1.1 1.1 0 1 0 2.2 0V4.4h6.6v1.1a1.1 1.1 0 0 0 2.2 0V4.4h2.2a1.1 1.1 0 0 1 1.1 1.1v3.3Z" />
);
