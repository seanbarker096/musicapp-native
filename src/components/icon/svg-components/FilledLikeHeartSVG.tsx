import { FC } from 'react';
import { Path } from 'react-native-svg';
import { SVGProps } from '../icon.types';

export const FilledLikeHeartSVG: FC<SVGProps> = () => (
  <Path
    fillRule="evenodd"
    d="M11 20c-.57 0-1.196-.263-1.74-.55-.58-.305-1.214-.72-1.84-1.168-1.64-1.175-3.353-2.621-4.662-4.326C1.447 12.25.5 10.23.5 7.934.5 4.58 3.343 2 6.68 2 8.4 2 9.914 2.834 11 3.914 12.086 2.834 13.6 2 15.32 2c3.337 0 6.18 2.581 6.18 5.934 0 2.296-.947 4.315-2.258 6.022-1.31 1.705-3.022 3.15-4.662 4.326-.626.449-1.26.863-1.84 1.168-.544.287-1.17.55-1.74.55Z"
    clipRule="evenodd"
  />
);
