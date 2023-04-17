import * as React from 'react';
import { FC } from 'react';
import { Path } from 'react-native-svg';
import { SVGProps } from '../icon.types';

export const TaggedUserSVG: FC<SVGProps> = () => (
  <>
    <Path
      fillRule="evenodd"
      stroke="#000"
      stroke-width="2"
      d="M3.5 4.005a1 1 0 0 1 1.003-1l15 .05a1 1 0 0 1 .997 1v11.504a1 1 0 0 1-1 1h-4a.5.5 0 0 0-.354.147L12 19.852l-3.146-3.146a.5.5 0 0 0-.354-.147h-4a1 1 0 0 1-1-1V4.005Zm1.007-2a2 2 0 0 0-2.007 2v11.554a2 2 0 0 0 2 2h3.793l3.353 3.354a.5.5 0 0 0 .708 0l3.353-3.354H19.5a2 2 0 0 0 2-2V4.054a2 2 0 0 0-1.993-2l-15-.049Z"
      clipRule="evenodd"
    />
    <Path
      fillRule="evenodd"
      stroke="#000"
      stroke-width="1"
      d="M12 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.5 7a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm-.965 7.5h6.93a3.501 3.501 0 0 0-6.93 0zM7.5 15a4.5 4.5 0 1 1 9 0 .5.5 0 0 1-.5.5H8a.5.5 0 0 1-.5-.5z"
      clipRule="evenodd"
    />
  </>
);
